// api/external/omnigateway/snapfood-blog.ts
import { createOmniGateway } from './index';
import {
  BlogParams,
  BlogsResponse,
  BlogResponse,
  BlogCategoriesResponse,
  CreateBlogData,
  UpdateBlogData,
  BlogCreateResponse,
  BlogUpdateResponse,
  NotificationResponse,
  NotificationReadResponse,
  SendNotificationData,
  ToggleStatusResponse,
  DeleteBlogResponse
} from '@/app/api/external/omnigateway/types/snapfood-blog';

export const createBlogApi = (clientApiKey: string) => {
  const omniGateway = createOmniGateway(clientApiKey);

  return {
    // Get blog categories
    getBlogCategories: async (): Promise<BlogCategoriesResponse> => {
      const { data } = await omniGateway.get('/sf/blogs/categories');
      return data;
    },

    // Get blogs with optional filtering
    getBlogs: async (params: BlogParams = {}): Promise<BlogsResponse> => {
      const { data } = await omniGateway.get('/sf/blogs', { params });
      return data;
    },

    // Get a specific blog by ID
    getBlog: async (id: number | string): Promise<BlogResponse> => {
      const { data } = await omniGateway.get(`/sf/blogs/${id}`);
      return data;
    },

    // Create a new blog
    createBlog: async (blogData: CreateBlogData): Promise<BlogCreateResponse> => {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(blogData).forEach(([key, value]) => {
        if (key === 'image_cover') {
          return; // Skip the file, we'll add it separately
        }
        
        if (key === 'blog_categories' && Array.isArray(value)) {
          value.forEach((id) => formData.append('blog_categories[]', id.toString()));
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add file if present
      if (blogData.image_cover) {
        formData.append('image_cover', blogData.image_cover);
      }
      
      const { data } = await omniGateway.post('/sf/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    },

    // Update an existing blog
    updateBlog: async (id: number | string, blogData: Partial<CreateBlogData>): Promise<BlogUpdateResponse> => {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(blogData).forEach(([key, value]) => {
        if (key === 'image_cover') {
          return; // Skip the file, we'll add it separately
        }
        
        if (key === 'blog_categories' && Array.isArray(value)) {
          value.forEach((id) => formData.append('blog_categories[]', id.toString()));
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add file if present
      if (blogData.image_cover) {
        formData.append('image_cover', blogData.image_cover);
      }
      
      // Add _method to simulate PUT request
      formData.append('_method', 'PUT');
      
      const { data } = await omniGateway.post(`/sf/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    },

    // Delete a blog
    deleteBlog: async (id: number | string): Promise<DeleteBlogResponse> => {
      const { data } = await omniGateway.delete(`/sf/blogs/${id}`);
      return data;
    },

    // Toggle blog active status
    toggleBlogStatus: async (id: number | string): Promise<ToggleStatusResponse> => {
      const { data } = await omniGateway.put(`/sf/blogs/${id}/toggle-status`);
      return data;
    },


    // Increment notification read count
    incrementNotificationReadCount: async (id: number | string): Promise<NotificationReadResponse> => {
      const { data } = await omniGateway.put(`/sf/blogs/${id}/notification-read`);
      return data;
    },

    // Send notification for a blog
    sendBlogNotification: async (id: number | string, notificationData: SendNotificationData): Promise<NotificationResponse> => {
      const { data } = await omniGateway.post(`/sf/blogs/${id}/send-notification`, notificationData);
      return data;
    }
  };
};