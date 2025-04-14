"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlogImageGalleryProps {
  images: string[];
  onRemoveImage?: (imageUrl: string) => void;
  onSelectCoverImage?: (imageUrl: string) => void;
  coverImage?: string;
}

export function BlogImageGallery({ 
  images, 
  onRemoveImage, 
  onSelectCoverImage,
  coverImage 
}: BlogImageGalleryProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Uploaded Images</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Use these images in your blog by copying their URLs. You can also set one as your cover image.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div 
            key={index} 
            className={`relative border rounded-md overflow-hidden ${
              coverImage === imageUrl ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img 
              src={imageUrl} 
              alt={`Uploaded image ${index + 1}`} 
              className="w-full h-32 object-cover"
            />
            
            <div className="absolute top-2 right-2 flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => handleCopyUrl(imageUrl)}
                    >
                      {copied === imageUrl ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {onRemoveImage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:text-destructive"
                        onClick={() => onRemoveImage(imageUrl)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {onSelectCoverImage && (
              <div className="p-2 bg-background/90 backdrop-blur-sm text-xs">
                <Button 
                  variant={coverImage === imageUrl ? "default" : "outline"} 
                  size="sm" 
                  className="w-full text-xs h-8"
                  onClick={() => onSelectCoverImage(imageUrl)}
                >
                  {coverImage === imageUrl ? "Current Cover" : "Set as Cover"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}