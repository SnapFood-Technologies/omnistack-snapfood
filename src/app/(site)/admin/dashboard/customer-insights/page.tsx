// app/admin/dashboard/customer-insights/page.tsx
import { CustomerInsightsContent } from "@/components/admin/dashboard/customer-insights-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Features Usage Stats - SnapFood Admin",
    description: "Indicates how many times features are clicked and how many times used",
};

export default function CustomerInsightsPage() {
    return (
        <div className="px-3">
            <CustomerInsightsContent />
        </div>
    )
}