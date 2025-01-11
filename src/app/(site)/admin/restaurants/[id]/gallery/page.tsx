// app/admin/restaurants/[id]/gallery/page.tsx
import { GalleryContent } from "@/components/admin/restaurants/gallery/gallery-content"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gallery - Restaurant Admin",
    description: "Manage restaurant gallery images",
}

export default function GalleryPage() {
    return (
        <div>
            <GalleryContent />
        </div>
    )
}