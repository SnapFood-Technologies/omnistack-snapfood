// app/admin/snapfoodies/page.tsx
import { SnapFoodiesContent } from "@/components/admin/snapfoodies/snapfoodies-content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SnapFoodies - Admin",
    description: "View and manage your SnapFoodies",
};

export default function SnapFoodUsersPage() {
    return (
        <div className="px-3">
            <SnapFoodiesContent />
        </div>
    )
}