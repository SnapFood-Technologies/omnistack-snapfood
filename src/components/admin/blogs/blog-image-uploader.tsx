"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { Image, X, Upload } from "lucide-react";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
}

export function BlogImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadBlogImage, isImageUploading } = useSnapFoodBlogs();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const imageUrl = await uploadBlogImage(selectedFile);
    if (imageUrl) {
      onImageSelected(imageUrl);
      setIsOpen(false);
      // Clean up
      setSelectedFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Clean up
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <>
      <div className="mb-6 p-4 border border-dashed rounded-md bg-muted/50">
        <div className="flex flex-col items-center justify-center text-center p-4">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Add images to your blog</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload images to include in your blog content or as a cover image.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Blog Image</DialogTitle>
            <DialogDescription>
              Upload an image to use in your blog post. The image will be stored and you'll get a URL to use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
              }`}
            >
              <input {...getInputProps()} />
              
              {preview ? (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-[200px] mx-auto rounded-md object-contain"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  {isDragActive ? (
                    <p className="text-sm font-medium">Drop the file here</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Drag & drop an image here, or click to select</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF, WEBP up to 5MB</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={handleClose} disabled={isImageUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isImageUploading}
            >
              {isImageUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}