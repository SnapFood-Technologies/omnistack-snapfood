// app/admin/restaurants/[id]/menu/manage/page.tsx
import { ManageMenu } from "@/components/admin/restaurants/menu/manage-menu"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Menu Management - Restaurant Admin",
    description: "Manage your restaurant's menu structure",
}

export default function MenuManagePage() {
    return (
        <div className="px-5">
            <ManageMenu />
        </div>
    )
}