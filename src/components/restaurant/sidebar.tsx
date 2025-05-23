"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingBasket,
    FileText,
    Users,
    Settings,
    Menu as MenuIcon,
    CreditCard
} from "lucide-react"

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
        color: "text-sky-500"
    },
    {
        label: 'My Orders',
        icon: ShoppingBasket,
        href: '/admin/orders',
        color: "text-violet-500",
    },
    {
        label: 'Menu Items',
        icon: FileText,
        color: "text-pink-700",
        href: '/admin/menu',
    },
    {
        label: 'My Staff',
        icon: Users,
        color: "text-orange-700",
        href: '/admin/staff',
    },
    {
        label: 'Transactions',
        icon: CreditCard,
        color: "text-emerald-500",
        href: '/admin/transactions',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-xl font-bold text-cyan-600">
                        Hire Chef
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                                pathname === route.href ? "text-cyan-600 bg-gray-100" : "text-gray-500"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}