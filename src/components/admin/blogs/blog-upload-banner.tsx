"use client";

import { useState } from "react";
import { Image, Upload, Check, Copy } from "lucide-react";
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
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export function BlogUploadBanner() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { uploadBlogImage, isImageUploading } = useSnapFoodBlogs();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

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
      setUploadedUrl(imageUrl);
      
      // Auto-copy to clipboard on success
      navigator.clipboard.writeText(imageUrl);
      setIsCopied(true);
      
      // Clean up preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  };

  const closeModal = () => {
    setIsUploadModalOpen(false);
    
    // Reset state when closing
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    if (!uploadedUrl) return;
    
    navigator.clipboard.writeText(uploadedUrl);
    setIsCopied(true);
    toast.success("URL copied to clipboard");
  };

  return (
    <>
      <Card className="mb-6 border-dashed border-primary/50 bg-primary/5">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
              <Image className="h-10 w-10 text-primary" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-lg font-medium mb-2">Upload Blog Images</h3>
              <p className="text-sm text-muted-foreground mb-0">
                Need to include images in your blog post? Upload them here to get a URL you can use in your content or as a cover image.
              </p>
            </div>
            
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <Button onClick={() => setIsUploadModalOpen(true)} className="w-full md:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Blog Image</DialogTitle>
            <DialogDescription>
              Upload an image to use in your blog posts. You'll get a URL you can use in your content.
            </DialogDescription>
          </DialogHeader>

          {!uploadedUrl ? (
            <div className="grid gap-4 py-4">
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="text-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-[200px] mx-auto rounded-md object-contain mb-4" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-1">
                      {isDragActive ? "Drop the file here" : "Drag & drop an image here, or click to select"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, GIF, WEBP (Max: 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-1">Upload Successful!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                The image URL has been copied to your clipboard.
              </p>
              
              <Button 
                variant="outline" 
                size="sm"
                className="mx-auto"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL Again
              </Button>
            </div>
          )}

          <DialogFooter>
            {!uploadedUrl ? (
              <>
                <Button variant="ghost" onClick={closeModal} disabled={isImageUploading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isImageUploading}
                >
                  {isImageUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </>
            ) : (
              <Button onClick={closeModal}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}