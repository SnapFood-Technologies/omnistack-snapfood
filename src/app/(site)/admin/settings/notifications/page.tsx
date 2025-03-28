// app/admin/notifications/page.tsx
import { NotificationsContent } from "@/components/admin/notifications/notifications-content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notification Types - Admin",
    description: "View all notification types and their delivery methods",
};

export default function NotificationsPage() {
    return (
        <div className="px-3">
            <NotificationsContent />
        </div>
    );
}