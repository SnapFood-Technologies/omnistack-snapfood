// app/admin/restaurants/page.tsx
import { RestaurantsContent } from "@/components/admin/restaurants/restaurants-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Restaurants - SnapFood Admin",
    description: "Admin dashboard for managing restaurants, orders, and platform analytics.",
};

export default function RestaurantsPage() {
    return (
        <div  className="px-3">
            <RestaurantsContent />
        </div>
    )
}