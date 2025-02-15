// app/admin/dashboard/page.tsx
import { DashboardContent } from "@/components/admin/dashboard/dashboard-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - SnapFood Admin",
    description: "Admin dashboard for managing restaurants, orders, and platform analytics.",
};

export default function DashboardPage() {
    return (
        <div className="px-3">
            <DashboardContent />
        </div>
    )
}