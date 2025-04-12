import { BlogEditor } from "@/components/admin/blogs/blog-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Blog - SnapFood Admin",
    description: "Create a new blog post for your platform.",
};

export default function NewBlogPage() {
    return (
        <div className="px-3">
            <BlogEditor isNew={true} />
        </div>
    );
}