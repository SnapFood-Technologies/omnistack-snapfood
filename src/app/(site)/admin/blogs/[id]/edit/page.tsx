// app/admin/blogs/[id]/edit/page.tsx
import { BlogEditor } from "@/components/admin/blogs/blog-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Blog - SnapFood Admin",
    description: "Edit blog post content and settings.",
};

export default function EditBlogPage({ params }: { params: { id: string } }) {
    return (
        <div className="px-3">
            <BlogEditor blogId={params.id} />
        </div>
    );
}