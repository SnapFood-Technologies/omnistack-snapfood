// components/admin/restaurants/tabs.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Truck,
  Settings,
  QrCode,
  ImageIcon
} from "lucide-react"

const TABS = [
  {
    title: "Dashboard",
    href: "",
    icon: LayoutDashboard,
    value: "dashboard"
  },
  {
    title: "Menu (Products & Categories)",
    href: "/menu",
    icon: UtensilsCrossed,
    value: "menu"
  },
  {
    title: "Delivery Zones",
    href: "/delivery-zones",
    icon: Truck,
    value: "delivery-zones"
  },
  {
    title: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
    value: "gallery"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    value: "settings"
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: QrCode,
    value: "qr-codes"
  }
]

export function RestaurantTabs({ restaurantId }: { restaurantId: string }) {
  const pathname = usePathname()
  
  // Get the active tab value based on the current pathname
  const getActiveTab = () => {
    const path = pathname.split('/').pop() || ''
    if (path === restaurantId || path === '') return 'dashboard'
    return path
  }

  const activeTab = getActiveTab()

  return (
    <Tabs value={activeTab} defaultValue="dashboard" className="space-y-4">
      <TabsList>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const href = `/admin/restaurants/${restaurantId}${tab.href}`
          const isActive = pathname === href
          
          return (
            <Link key={tab.href} href={href}>
              <TabsTrigger
                value={tab.value}
                className={`flex items-center gap-2 ${isActive ? 'font-medium' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {tab.title}
              </TabsTrigger>
            </Link>
          )
        })}
      </TabsList>
    </Tabs>
  )
}