// components/admin/blogs/create-blog-modal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./multi-select";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Mock categories for the dropdown
const mockCategories = [
  { id: "1", title: "Food", title_en: "Food" },
  { id: "2", title: "Health", title_en: "Health" },
  { id: "3", title: "Safety", title_en: "Safety" },
  { id: "4", title: "Tips", title_en: "Tips" },
  { id: "5", title: "Trends", title_en: "Trends" },
  { id: "6", title: "Seasonal", title_en: "Seasonal" },
  { id: "7", title: "Etiquette", title_en: "Etiquette" },
  { id: "8", title: "Dining", title_en: "Dining" },
  { id: "9", title: "Budget", title_en: "Budget" },
];

export function CreateBlogModal({ isOpen, onClose, onSuccess }: CreateBlogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("1"); // Active by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would normally submit to your API
      console.log("Form data:", {
        title,
        titleEn,
        content,
        contentEn,
        author,
        status,
        selectedCategories,
        notificationTitle,
        notificationTitleEn,
        blogImage,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create blog post");
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
    setNotificationTitle("");
    setNotificationTitleEn("");
    setBlogImage(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a new blog</DialogTitle>
          <DialogDescription>
            Create a new blog post to share with your users
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-en">Content (English)</Label>
            <Textarea
              id="content-en"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder="Enter content (English)"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notification-title">Notification Title</Label>
              <Input
                id="notification-title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Enter notification title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-title-en">Notification Title (English)</Label>
              <Input
                id="notification-title-en"
                value={notificationTitleEn}
                onChange={(e) => setNotificationTitleEn(e.target.value)}
                placeholder="Enter notification title (English)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Blog Categories</Label>
            <MultiSelect
              options={mockCategories.map(cat => ({ 
                label: cat.title, 
                value: cat.id 
              }))}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Select categories..."
            />
          </div>

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
              type="submit" 
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
        </form>
      </DialogContent>
    </Dialog>
  );
}