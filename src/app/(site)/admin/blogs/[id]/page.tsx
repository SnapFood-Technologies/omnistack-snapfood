// app/admin/blogs/[id]/page.tsx
import { Metadata } from "next";
import { BlogDetails } from "@/components/admin/blogs/blog-details";

export const metadata: Metadata = {
    title: "View Blog - SnapFood Admin",
    description: "View blog post details and analytics.",
};

export default function BlogViewPage({ params }: { params: { id: string } }) {
    return (
        <div className="px-3">
            <BlogDetails blogId={params.id} />
        </div>
    );
}