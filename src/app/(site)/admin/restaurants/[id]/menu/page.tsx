// app/admin/restaurants/[id]/menu/page.tsx
import { MenuContent } from "@/components/admin/restaurants/menu/menu-content"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Menu - Restaurant Admin",
    description: "Manage restaurant menu, categories, and products",
}

export default function MenuPage() {
    return (
        <div>
            <MenuContent />
        </div>
    )
}