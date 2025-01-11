// app/admin/dashboard/page.tsx
import { RestaurantsContent } from "@/components/admin/restaurants/restaurants-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Restaurants - Snapfood Admin",
    description: "Admin dashboard for managing restaurants, orders, and platform analytics.",
};

export default function RestaurantsPage() {
    return (
        <div  className="px-5">
            <RestaurantsContent />
        </div>
    )
}