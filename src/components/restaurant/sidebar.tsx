// src/components/restaurant/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    MenuSquare,
    ShoppingBag,
    Settings
} from "lucide-react"

const restaurantRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/restaurant/dashboard",
    },
    {
        label: "Menu",
        icon: MenuSquare,
        href: "/restaurant/menu",
    },
    {
        label: "Orders",
        icon: ShoppingBag,
        href: "/restaurant/orders",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/restaurant/settings",
    },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="fixed left-0 flex h-full w-56 flex-col border-r bg-background pt-16">
            <div className="flex-1 space-y-1 p-3">
                {restaurantRoutes.map((route) => (
                    <Button
                        key={route.href}
                        variant={pathname === route.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        asChild
                    >
                        <Link href={route.href}>
                            <route.icon className="mr-2 h-4 w-4" />
                            {route.label}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    )
}