// app/admin/dashboard/page.tsx
import { DashboardContent } from "@/components/admin/dashboard/dashboard-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - SnapFood Admin",
    description: "Monitor your restaurant network and delivery performance metrics",
};

export default function DashboardPage() {
    return (
        <div className="px-3">
            <DashboardContent />
        </div>
    )
}