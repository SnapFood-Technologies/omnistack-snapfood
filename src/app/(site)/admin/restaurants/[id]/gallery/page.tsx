// src/app/admin/restaurants/[id]/gallery/page.tsx
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash2, UploadCloud } from "lucide-react"
import { useToast } from "@/components/ui/toast-context" // Updated import

interface Image {
  id: string
  url: string
  name: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { addToast } = useToast() // Using addToast from context

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) handleFiles(Array.from(files))
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
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
      }
    })
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
    addToast({  // Using addToast instead of toast
      title: "Image deleted",
      description: "The image has been removed from your gallery."
    })
  }

  if (images.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
          <Button>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop images here, or{" "}
                <span className="text-primary">browse</span>
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={onFileChange}
                accept="image/*"
                multiple
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
        <label htmlFor="file-upload">
          <Button asChild>
            <span>
              <ImagePlus className="mr-2 h-4 w-4" />
              Add More Images
            </span>
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept="image/*"
          multiple
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteImage(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mt-6 ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className="text-sm text-gray-500">
          Drop more images here to add to your gallery
        </p>
      </div>
    </div>
  )
}