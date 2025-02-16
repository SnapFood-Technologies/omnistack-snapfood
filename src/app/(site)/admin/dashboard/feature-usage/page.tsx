// app/admin/dashboard/feature-usage/page.tsx
import { FeatureUsageContent } from "@/components/admin/dashboard/feature-usage-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Features Usage Stats - SnapFood Admin",
    description: "",
};

export default function FeatureUsagePage() {
    return (
        <div className="px-3">
            <FeatureUsageContent />
        </div>
    )
}