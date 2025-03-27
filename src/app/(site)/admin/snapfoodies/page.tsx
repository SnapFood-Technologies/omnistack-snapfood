// app/admin/snapfoodies/page.tsx
import { SnapFoodUsersContent } from "@/components/admin/snapfoodies/snapfoodies-content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SnapFood Users - Admin",
    description: "View and manage your SnapFood users",
};

export default function SnapFoodUsersPage() {
    return (
        <div className="px-3">
            <SnapFoodUsersContent />
        </div>
    )
}