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
    shortTitle: "Dashboard", // Same for mobile
    href: "",
    icon: LayoutDashboard,
    value: "dashboard"
  },
  {
    title: "Menu (Products & Categories)",
    shortTitle: "Menu", // Shorter for mobile
    href: "/menu",
    icon: UtensilsCrossed,
    value: "menu"
  },
  {
    title: "Delivery Zones",
    shortTitle: "Delivery",
    href: "/delivery-zones",
    icon: Truck,
    value: "delivery-zones"
  },
  {
    title: "Gallery",
    shortTitle: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
    value: "gallery"
  },
  {
    title: "Settings",
    shortTitle: "Settings",
    href: "/settings",
    icon: Settings,
    value: "settings"
  },
  {
    title: "QR Codes",
    shortTitle: "QR",
    href: "/qr-codes",
    icon: QrCode,
    value: "qr-codes"
  }
]

export function RestaurantTabs({ restaurantId }: { restaurantId: string }) {
  const pathname = usePathname()
  
  const getActiveTab = () => {
    const path = pathname.split('/').pop() || ''
    if (path === restaurantId || path === '') return 'dashboard'
    return path
  }

  const activeTab = getActiveTab()

  return (
    <Tabs value={activeTab} defaultValue="dashboard" className="space-y-4">
      <TabsList className="flex flex-wrap gap-2 h-auto">
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
                <span className="hidden md:inline">{tab.title}</span>
                <span className="md:hidden">{tab.shortTitle}</span>
              </TabsTrigger>
            </Link>
          )
        })}
      </TabsList>
    </Tabs>
  )
}