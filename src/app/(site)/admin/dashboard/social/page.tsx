// app/admin/dashboard/social/page.tsx
import { SocialContent } from "@/components/admin/dashboard/social-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Social Dashboard & Stats - SnapFood Admin",
    description: "",
};

export default function SocialPage() {
    return (
        <div className="px-3">
            <SocialContent />
        </div>
    )
}