// hooks/useSnapFoodBlogs.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  BlogParams, 
  Blog, 
  BlogCategory,
  CreateBlogData,
  UpdateBlogData,
  SendNotificationData
} from '@/app/api/external/omnigateway/types/snapfood-blog';
import { useClient } from './useClient';
import { createBlogApi } from '@/app/api/external/omnigateway/snapfood-blog';
import toast from 'react-hot-toast';

export const useSnapFoodBlogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  
  const { gatewayApiKey } = useClient();
  
  const blogApi = useMemo(() => {
    return gatewayApiKey ? createBlogApi(gatewayApiKey) : null;
  }, [gatewayApiKey]);

  // Fetch all blogs with optional filtering
  const fetchBlogs = useCallback(async (params: BlogParams = {}) => {
    if (!blogApi) return;
    
    try {
      setIsLoading(true);
      const response = await blogApi.getBlogs(params);
      
      if (response.success) {
        setBlogs(response.blogs.data || []);
        setTotalItems(response.blogs.total);
        setTotalPages(response.blogs.last_page);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, [blogApi]);

  // Fetch blog categories
  const fetchCategories = useCallback(async () => {
    if (!blogApi) return;
    
    try {
      const response = await blogApi.getBlogCategories();
      
      if (response.success) {
        setCategories(response.categories || []);
      } else {
        toast.error('Failed to fetch blog categories');
      }
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      toast.error('Failed to fetch blog categories');
    }
  }, [blogApi]);

  // Fetch a specific blog
  const fetchBlog = useCallback(async (id: number | string) => {
    if (!blogApi) return null;
    
    try {
      setIsLoading(true);
      const response = await blogApi.getBlog(id);
      
      if (response.success) {
        setCurrentBlog(response.blog);
        return response.blog;
      } else {
        toast.error('Failed to fetch blog');
        return null;
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi]);

  // Create a new blog
  const createBlog = useCallback(async (blogData: CreateBlogData) => {
    if (!blogApi) return false;
    
    try {
      setIsLoading(true);
      const response = await blogApi.createBlog(blogData);
      
      if (response.success) {
        toast.success('Blog created successfully');
        
        // Show notification status if applicable
        if (blogData.send_notification === '1') {
          toast.success(`Sent ${response.notifications_sent} notifications`);
        }
        
        return true;
      } else {
        toast.error('Failed to create blog');
        return false;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi]);

  // Update an existing blog
  const updateBlog = useCallback(async (id: number | string, blogData: Partial<CreateBlogData>) => {
    if (!blogApi) return false;
    
    try {
      setIsLoading(true);
      const response = await blogApi.updateBlog(id, blogData);
      
      if (response.success) {
        toast.success('Blog updated successfully');
        
        // Show notification status if applicable
        if (blogData.send_notification === '1' && response.notifications_sent) {
          toast.success(`Sent ${response.notifications_sent} notifications`);
        }
        
        // Update current blog if it's the one we're editing
        if (currentBlog && currentBlog.id === Number(id)) {
          setCurrentBlog(response.blog);
        }
        
        return true;
      } else {
        toast.error('Failed to update blog');
        return false;
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi, currentBlog]);

  // Delete a blog
  const deleteBlog = useCallback(async (id: number | string) => {
    if (!blogApi) return false;
    
    try {
      setIsLoading(true);
      const response = await blogApi.deleteBlog(id);
      
      if (response.success) {
        toast.success('Blog deleted successfully');
        
        // Update blogs list to remove the deleted item
        setBlogs(prev => prev.filter(blog => blog.id !== Number(id)));
        
        return true;
      } else {
        toast.error('Failed to delete blog');
        return false;
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi]);

  // Toggle blog active status
  const toggleBlogStatus = useCallback(async (id: number | string) => {
    if (!blogApi) return false;
    
    try {
      setIsLoading(true);
      const response = await blogApi.toggleBlogStatus(id);
      
      if (response.success) {
        toast.success(`Blog status ${response.active ? 'activated' : 'deactivated'} successfully`);
        
        // Update blogs list to reflect the new status
        setBlogs(prev => prev.map(blog => 
          blog.id === Number(id) 
            ? { ...blog, active: response.active ? 1 : 0 } 
            : blog
        ));
        
        // Update current blog if it's the one we're toggling
        if (currentBlog && currentBlog.id === Number(id)) {
          setCurrentBlog({ ...currentBlog, active: response.active ? 1 : 0 });
        }
        
        return true;
      } else {
        toast.error('Failed to toggle blog status');
        return false;
      }
    } catch (error) {
      console.error('Error toggling blog status:', error);
      toast.error('Failed to toggle blog status');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi, currentBlog]);



  // Increment notification read count
  const incrementNotificationRead = useCallback(async (id: number | string) => {
    if (!blogApi) return false;
    
    try {
      const response = await blogApi.incrementNotificationReadCount(id);
      
      if (response.success) {
        // Update current blog if it's the one we're incrementing
        if (currentBlog && currentBlog.id === Number(id)) {
          setCurrentBlog({
            ...currentBlog,
            notifications_read_count: response.notifications_read_count
          });
        }
        
        // Update blogs list to reflect the new count
        setBlogs(prev => prev.map(blog => 
          blog.id === Number(id) 
            ? { ...blog, notifications_read_count: response.notifications_read_count } 
            : blog
        ));
        
        return true;
      } else {
        toast.error('Failed to increment notification read count');
        return false;
      }
    } catch (error) {
      console.error('Error incrementing notification read count:', error);
      toast.error('Failed to increment notification read count');
      return false;
    }
  }, [blogApi, currentBlog]);

  // Send notification for a blog
  const sendNotification = useCallback(async (id: number | string, notificationData: SendNotificationData) => {
    if (!blogApi) return false;
    
    try {
      setIsLoading(true);
      const response = await blogApi.sendBlogNotification(id, notificationData);
      
      if (response.success) {
        toast.success(`Successfully sent ${response.notifications_sent} notifications`);
        
        // Update current blog if it's the one we're sending notifications for
        if (currentBlog && currentBlog.id === Number(id)) {
          setCurrentBlog({
            ...currentBlog,
            notifications_sent: currentBlog.notifications_sent + response.notifications_sent
          });
        }
        
        // Update blogs list to reflect the new sent count
        setBlogs(prev => prev.map(blog => 
          blog.id === Number(id) 
            ? { ...blog, notifications_sent: blog.notifications_sent + response.notifications_sent } 
            : blog
        ));
        
        return true;
      } else {
        toast.error('Failed to send notifications');
        return false;
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error('Failed to send notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [blogApi, currentBlog]);

  // Initial fetch of categories
  useEffect(() => {
    if (blogApi) {
      fetchCategories();
    }
  }, [blogApi, fetchCategories]);

  return {
    isLoading,
    blogs,
    categories,
    totalItems,
    totalPages,
    currentBlog,
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    incrementNotificationRead,
    sendNotification,
    isInitialized: !!blogApi
  };
};