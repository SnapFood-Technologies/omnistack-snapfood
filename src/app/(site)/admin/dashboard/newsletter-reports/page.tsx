// app/admin/dashboard/newsletter-reports/page.tsx
import { NewsletterContent } from "@/components/admin/dashboard/newsletter-reports-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter Reports - SnapFood Admin",
    description: "Track and Analyze SnapFood Email Campaigns Performance",
};

export default function NewsletterReportsPage() {
    return (
        <div className="px-3">
            <NewsletterContent />
        </div>
    )
}