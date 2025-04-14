"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";

import { MultiSelect } from "./multi-select";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "./rich-text-editor";
import InputSelect from "@/components/Common/InputSelect";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateBlogModal({ isOpen, onClose, onSuccess }: CreateBlogModalProps) {
  const { toast } = useToast();
  const { categories, createBlog } = useSnapFoodBlogs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("1"); // Active by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState("0"); // No quiz by default
  const [sendNotification, setSendNotification] = useState("0"); // No notification by default
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationTitleEn, setNotificationTitleEn] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setBlogImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async () => {
    if (!title || !titleEn || !content || !contentEn || !author || selectedCategories.length === 0) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and select at least one category.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Require blog image
  if (!blogImage) {
    toast({
      title: "Image Required",
      description: "Please upload a blog banner image.",
      variant: "destructive",
    });
    return;
  }

    // If sending notification, require notification titles
    if (sendNotification === "1" && (!notificationTitle || !notificationTitleEn)) {
      toast({
        title: "Missing Notification Titles",
        description: "Please fill in notification titles for both languages.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await createBlog({
        title,
        title_en: titleEn,
        content,
        content_en: contentEn,
        author,
        active: status,
        show_quiz: showQuiz,
        send_notification: sendNotification,
        notification_title: notificationTitle,
        notification_title_en: notificationTitleEn,
        blog_categories: selectedCategories.map(id => parseInt(id)),
        image_cover: blogImage || undefined
      });
      
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setTitleEn("");
    setContent("");
    setContentEn("");
    setAuthor("");
    setStatus("1");
    setSelectedCategories([]);
    setShowQuiz("0");
    setSendNotification("0");
    setNotificationTitle("");
    setNotificationTitleEn("");
    setBlogImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Post a new blog</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Create a new blog post to share with your users
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-en">Title (English)</Label>
              <Input
                id="title-en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Enter title (English)"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor 
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content_en">Content (English)</Label>
            <RichTextEditor 
              value={contentEn}
              onChange={setContentEn}
              placeholder="Write your blog content in English here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <InputSelect
                name="status"
                label=""
                options={[
                  { value: "1", label: "Active" },
                  { value: "0", label: "Inactive" },
                ]}
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categories">Blog Categories</Label>
              <MultiSelect
                options={categories.map(cat => ({ 
                  label: cat.title, 
                  value: cat.id.toString() 
                }))}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select categories..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show-quiz">Show Quiz</Label>
              <InputSelect
                name="show-quiz"
                label=""
                options={[
                  { value: "0", label: "No" },
                  { value: "1", label: "Yes" },
                ]}
                onChange={(e) => setShowQuiz(e.target.value)}
                value={showQuiz}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="send-notification">Send Notification</Label>
              <InputSelect
                name="send-notification"
                label=""
                options={[
                  { value: "0", label: "No" },
                  // { value: "1", label: "Yes" },
                ]}
                onChange={(e) => setSendNotification(e.target.value)}
                value={sendNotification}
              />
            </div>
          </div>

          {sendNotification === "1" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notification-title">Notification Title</Label>
                <Input
                  id="notification-title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                  required={sendNotification === "1"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-title-en">Notification Title (English)</Label>
                <Input
                  id="notification-title-en"
                  value={notificationTitleEn}
                  onChange={(e) => setNotificationTitleEn(e.target.value)}
                  placeholder="Enter notification title (English)"
                  required={sendNotification === "1"}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="blog-image">Blog Banner Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img 
                    src={imagePreview} 
                    alt="Blog banner preview" 
                    className="object-cover w-full h-full rounded-md"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setBlogImage(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop or click to upload
                  </p>
                  <Input
                    id="blog-image"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('blog-image')?.click()}
                  >
                    Select Image
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Blog"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}