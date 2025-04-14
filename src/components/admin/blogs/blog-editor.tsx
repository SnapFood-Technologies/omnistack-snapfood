"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  Trash2, 
  Upload
} from "lucide-react";
import Link from "next/link";
import { MultiSelect } from "./multi-select";
import InputSelect from "@/components/Common/InputSelect";
import { RichTextEditor } from "./rich-text-editor";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";

interface BlogEditorProps {
  blogId?: string;
  isNew?: boolean;
}

export function BlogEditor({ blogId, isNew = false }: BlogEditorProps) {
  const { toast } = useToast();
  const { 
    categories, 
    fetchBlog, 
    createBlog, 
    updateBlog, 
    isLoading: apiLoading 
  } = useSnapFoodBlogs();
  
  // Local loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Blog data
  const [blog, setBlog] = useState({
    title: "",
    title_en: "",
    content: "",
    content_en: "",
    author: "",
    active: "1",
    show_quiz: "0",
    send_notification: "0",
    notification_title: "",
    notification_title_en: "",
    image_cover: "",
    blog_categories: [] as string[],
    categories: [] as string[]
  });
  
  // File upload state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Load blog data if editing
  useEffect(() => {
    async function loadBlog() {
      if (isNew) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        if (blogId) {
          const blogData = await fetchBlog(blogId);
          
          if (blogData) {
            setBlog({
              title: blogData.title || "",
              title_en: blogData.title_en || "",
              content: blogData.content || "",
              content_en: blogData.content_en || "",
              author: blogData.author || "",
              active: blogData.active || "1",
              show_quiz: blogData.show_quiz || "0",
              send_notification: blogData.send_notification || "0",
              notification_title: blogData.notification_title || "",
              notification_title_en: blogData.notification_title_en || "",
              image_cover: blogData.image_cover || "",
              blog_categories: blogData.blog_categories ? blogData.blog_categories.map(cat => cat.id.toString()) : [],
              categories: blogData.categories ? blogData.categories.map(cat => cat.id.toString()) : []
            });
            
            // Set preview if image exists
            if (blogData.image_cover) {
              setCoverPreview(blogData.image_cover);
            }
          }
        }
      } catch (error) {
        console.error("Error loading blog:", error);
        toast({
          title: "Error",
          description: "Failed to load blog data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBlog();
  }, [blogId, isNew, fetchBlog, toast]);
  
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    
    // Check if the path already includes the base URL
    if (path.startsWith('http')) {
      return path;
    }
    
    // Otherwise, prepend the base URL
    return `https://snapfoodal.imgix.net/${path}`;
  };
  
  // Handle file uploads
  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCoverFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle content changes
  const handleContentChange = (content: string) => {
    setBlog(prev => ({
      ...prev,
      content
    }));
  };
  
  const handleContentEnChange = (content: string) => {
    setBlog(prev => ({
      ...prev,
      content_en: content
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setBlog(prev => ({
      ...prev,
      active: checked
    }));
  };
  
  const handleCategoryChange = (selected: string[]) => {
    setBlog(prev => ({
      ...prev,
      blog_categories: selected
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = {
        title: blog.title,
        content: blog.content,
        title_en: blog.title_en,
        content_en: blog.content_en,
        author: blog.author,
        active: blog.active,
        show_quiz: blog.show_quiz,
        send_notification: blog.send_notification,
        notification_title: blog.notification_title,
        notification_title_en: blog.notification_title_en,
        blog_categories: blog.blog_categories.map(id => parseInt(id)),
      };
      
      let success = false;
      
     
      if (isNew) {
        // Create new blog
        success = await createBlog({
          ...formData,
          image_cover: coverFile || undefined
        });
      } else if (blogId) {
        // Update existing blog
        success = await updateBlog(blogId, {
          ...formData,
          image_cover: coverFile || undefined
        });
      }
      
      if (success) {
        // Redirect to blog list after success
        window.location.href = '/admin/blogs';
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: `Failed to ${isNew ? 'create' : 'update'} blog`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isNew ? "Create New Blog" : "Edit Blog"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isNew ? "Create a new blog post" : "Edit an existing blog post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={blog.active}
              onCheckedChange={handleSwitchChange}
              id="blog-active"
            />
            <Label htmlFor="blog-active">Active</Label>
          </div>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Blog
              </>
            )}
          </Button>
        </div>
      </div>
      
      <form>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Basic Information</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Set the title, content, and author for your blog post
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={blog.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input
                    id="title_en"
                    name="title_en"
                    value={blog.title_en}
                    onChange={handleInputChange}
                    placeholder="Enter blog title (English)"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={blog.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                {!isLoading && (
                  <RichTextEditor
                    value={blog.content}
                    onChange={handleContentChange}
                    placeholder="Write your blog content here..."
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  Use the toolbar to format your content. You can add headers, lists, images, and more.
                </p>
              </div>
              
              <div className="space-y-2 mt-8">
                <Label htmlFor="content_en">Content (English)</Label>
                {!isLoading && (
                  <RichTextEditor
                    value={blog.content_en}
                    onChange={handleContentEnChange}
                    placeholder="Write your blog content in English here..."
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  Format your English content using the toolbar.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Categories & Settings</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Configure categories and additional settings for your blog
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog_categories">Blog Categories</Label>
                  <MultiSelect
                    options={categories.map(cat => ({ 
                      label: cat.title, 
                      value: cat.id.toString() 
                    }))}
                    selected={blog.categories}
                    onChange={handleCategoryChange}
                    placeholder="Select categories..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show_quiz">Show Quiz</Label>
                  <InputSelect
                    name="show_quiz"
                    label=""
                    options={[
                      { value: "0", label: "No" },
                      { value: "1", label: "Yes" },
                    ]}
                    onChange={handleSelectChange}
                    value={blog.show_quiz}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Configure push notifications for this blog post
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="send_notification">Send Notification</Label>
                  <InputSelect
                    name="send_notification"
                    label=""
                    options={[
                      { value: "0", label: "No" },
                    ]}
                    onChange={handleSelectChange}
                    value={blog.send_notification}
                  />
                </div>
              </div>
              
              {blog.send_notification === "1" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification_title">Notification Title</Label>
                    <Input
                      id="notification_title"
                      name="notification_title"
                      value={blog.notification_title}
                      onChange={handleInputChange}
                      placeholder="Enter notification title"
                      required={blog.send_notification === "1"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification_title_en">Notification Title (English)</Label>
                    <Input
                      id="notification_title_en"
                      name="notification_title_en"
                      value={blog.notification_title_en}
                      onChange={handleInputChange}
                      placeholder="Enter notification title (English)"
                      required={blog.send_notification === "1"}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Blog Cover Image</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Upload a cover image for your blog post
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                  {coverPreview ? (
                    <div className="relative w-full">
                      <img
                      src={getImageUrl(coverPreview)} 
                        // src={coverPreview} 
                        alt="Blog cover preview" 
                        className="object-cover w-full h-64 rounded-md"
                      />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        type="button"
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverFile(null);
                          setBlog(prev => ({ ...prev, image_cover: "" }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop or click to upload
                      </p>
                      <Input
                        id="cover-upload"
                        type="file"
                        className="hidden"
                        onChange={handleCoverUpload}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                      >
                        Select Image
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
      
      <div className="h-10"></div>
    </div>
  );
}