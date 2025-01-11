// components/admin/restaurant/gallery/gallery-content.tsx
"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash2, UploadCloud, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Image {
  id: string
  url: string
  name: string
}

export function GalleryContent() {
  const [images, setImages] = useState<Image[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) handleFiles(Array.from(files))
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    )

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Some files were skipped. Please ensure all files are images under 10MB.",
        variant: "destructive"
      })
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: e.target?.result as string,
          name: file.name
        }
        setImages(prev => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    // Show success toast if any files were processed
    if (validFiles.length > 0) {
      toast({
        title: "Images uploaded",
        description: `Successfully added ${validFiles.length} image${validFiles.length === 1 ? '' : 's'} to the gallery.`
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
    toast({
      title: "Image deleted",
      description: "The image has been removed from your gallery.",
    })
  }

  const handleButtonClick = () => {
    // Trigger the hidden file input
    document.getElementById('file-upload')?.click()
  }

  return (
    <div className="space-y-6">
      {/* Header section following dashboard pattern */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant's image gallery and showcase your venue
        </p>
      </div>

      {/* Upload Card */}
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Upload Images</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your images or click to browse
              </p>
            </div>
            <Button onClick={handleButtonClick}>
              <ImagePlus className="mr-2 h-4 w-4" />
              {images.length === 0 ? 'Add Images' : 'Add More Images'}
            </Button>
          </div>
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            onChange={onFileChange}
            accept="image/*"
            multiple
            ref={fileInputRef}
          />

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[0.99]' 
                : 'border-gray-200 hover:bg-gray-50/75'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleButtonClick}
            style={{ cursor: 'pointer' }}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <span className="mt-2 block text-sm font-medium">
                Drop images here, or{" "}
                <span className="text-primary hover:underline">browse</span>
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Support for PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gallery Images</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {images.length} image{images.length === 1 ? '' : 's'} in your gallery
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="relative group rounded-lg overflow-hidden aspect-[4/3] bg-gray-100"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-white text-sm font-medium truncate pr-4">
                        {image.name}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}