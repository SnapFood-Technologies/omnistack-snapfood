// app/admin/blogs/page.tsx
import { BlogsContent } from "@/components/admin/blogs/blogs-content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blogs - SnapFood Admin",
    description: "Manage blog posts and content for your platform.",
};

export default function BlogsPage() {
    return (
        <div className="px-3">
            <BlogsContent />
        </div>
    );
}