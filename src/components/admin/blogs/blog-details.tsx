"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Eye,
  MessageSquare,
  Share2,
  ThumbsUp,
  User,
  Bell,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "./rich-text-editor";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";
import { SendNotificationModal } from "./send-notification-modal";
import toast from "react-hot-toast";

interface BlogDetailsProps {
  blogId: string;
}

export function BlogDetails({ blogId }: BlogDetailsProps) {
  const { currentBlog, fetchBlog, isLoading, incrementNotificationRead } = useSnapFoodBlogs();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [localReadCount, setLocalReadCount] = useState(0);
  const [isIncreasingView, setIsIncreasingView] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function loadBlog() {
      if (isMounted) {
        const blog = await fetchBlog(blogId);
        if (blog && isMounted) {
          setLocalReadCount(blog.read_count);
        }
      }
    }
    
    loadBlog();
    
    return () => {
      isMounted = false;
    };
  }, [blogId, fetchBlog]);

  const handleSendNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleIncreaseView = async () => {
    try {
      setIsIncreasingView(true);
      
      // Use the hook from useSnapFoodBlogs instead of direct API call
      const success = await incrementNotificationRead(blogId);
      
      if (success) {
        setLocalReadCount(prev => prev + 1);
        toast.success("View count increased successfully");
      } else {
        toast.error("Failed to increase view count");
      }
    } catch (error) {
      console.error("Error increasing view count:", error);
      toast.error("Failed to increase view count");
    } finally {
      setIsIncreasingView(false);
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    
    // Check if the path already includes the base URL
    if (path.startsWith('http')) {
      return path;
    }
    
    // Otherwise, prepend the base URL
    return `https://snapfoodal.imgix.net/${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-muted-foreground mb-4">Blog not found</p>
        <Link href="/admin/blogs">
          <Button>Go back to blogs</Button>
        </Link>
      </div>
    );
  }

  const showQuizStatus = currentBlog.show_quiz === 1 || currentBlog.show_quiz === '1' ? 'Yes' : 'No';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Blog Details</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${currentBlog.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button onClick={handleSendNotificationClick}>
            <Bell className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Blog Header - Added extra margin bottom to create space */}
      <div className="relative mb-8">
        <div className="w-full h-72 overflow-hidden rounded-lg">
          {currentBlog.image_cover ? (
            <img
              src={getImageUrl(currentBlog.image_cover)}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">{currentBlog.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={currentBlog.active === 1 ? "default" : "destructive"}>
                  {currentBlog.active === 1 ? "Active" : "Inactive"}
                </Badge>
                {currentBlog.categories && currentBlog.categories.map((category, i) => (
                  <Badge key={i} variant="outline" className="mr-1">
                    {category.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Blog Content */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Content</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Published content for this blog post
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={currentBlog.content}
                onChange={() => {}} // Explicitly empty function
                placeholder=""
                readOnly={true}
              />
            </CardContent>
          </Card>

          {/* English Content */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Content (English)
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  English version of the blog content
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={currentBlog.content_en}
                onChange={() => {}} // Explicitly empty function
                placeholder=""
                readOnly={true}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Blog Info */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Blog Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Basic details about this blog post
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Author
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{currentBlog.author}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Published Date
                </h3>
                <div className="mt-1">
                  {new Date(currentBlog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Show Quiz
                </h3>
                <div className="mt-1">{showQuizStatus}</div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics - Fixed the Increase View button position */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Analytics
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Engagement metrics for this blog
                  </p>
                </div>
                <Button 
                  onClick={handleIncreaseView} 
                  disabled={isIncreasingView}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Increase Views
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Read Count</div>
                  <div className="text-2xl font-bold mt-1 flex items-center">
                    <Eye className="h-5 w-5 text-primary mr-2" />
                    {localReadCount.toLocaleString()}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">
                    Notifications
                  </div>
                  <div className="text-2xl font-bold mt-1 flex items-center">
                    <MessageSquare className="h-5 w-5 text-primary mr-2" />
                    {currentBlog.notifications_sent.toLocaleString()}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">
                    Notif. Opened
                  </div>
                  <div className="text-2xl font-bold mt-1 flex items-center">
                    <ThumbsUp className="h-5 w-5 text-primary mr-2" />
                    {currentBlog.notifications_read_count.toLocaleString()}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Open Rate</div>
                  <div className="text-2xl font-bold mt-1 flex items-center">
                    <Share2 className="h-5 w-5 text-primary mr-2" />
                    {currentBlog.notifications_sent > 0
                      ? Math.round(
                          (currentBlog.notifications_read_count / currentBlog.notifications_sent) *
                            100
                        )
                      : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Info */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Notification Details
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Push notification configuration
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Send Notification
                </h3>
                <div className="mt-1">
                  {currentBlog.send_notification === "1" ? "Yes" : "No"}
                </div>
              </div>

              {currentBlog.send_notification === "1" && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Notification Title
                    </h3>
                    <div className="mt-1 flex items-center">
                      <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                      {currentBlog.notification_title}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Notification Title (English)
                    </h3>
                    <div className="mt-1 flex items-center">
                      <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                      {currentBlog.notification_title_en}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        blogId={Number(blogId)}
        onSuccess={() => fetchBlog(blogId)}
      />

      <div className="h-10"></div>
    </div>
  );
}