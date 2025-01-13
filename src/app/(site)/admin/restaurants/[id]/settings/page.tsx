// app/admin/restaurants/[id]/settings/page.tsx
import { RestaurantSettings } from "@/components/admin/restaurants/settings/restaurant-settings"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings - Restaurant Admin",
    description: "Configure your restaurant settings, working hours, and delivery options",
}

export default function SettingsPage() {
    return (
        <div>
            <RestaurantSettings />
        </div>
    )
}