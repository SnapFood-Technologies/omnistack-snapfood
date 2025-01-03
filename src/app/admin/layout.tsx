import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"  // Changed from '@/auth'
import Header from '@/components/dashboard/header'
import Sidebar from '@/components/dashboard/sidebar'

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode
}) {
    const session = await getAuthSession()
    if (!session) {
        redirect("/login")
    }

    if (session.user.role !== "ADMIN") {
        redirect("/restaurant/dashboard")
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 pt-16 ml-56">
                    {children}
                </main>
            </div>
        </div>
    )
}