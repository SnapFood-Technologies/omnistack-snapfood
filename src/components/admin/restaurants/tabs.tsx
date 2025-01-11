// components/admin/restaurant/tabs.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ListTree,
  Package,
  Truck,
  MapPin,
  Settings,
  QrCode
} from "lucide-react"

const TABS = [
  {
    title: "Dashboard",
    href: "",
    icon: LayoutDashboard
  },
  {
    title: "Menu",
    href: "/menu",
    icon: UtensilsCrossed
  },
  {
    title: "Categories",
    href: "/categories",
    icon: ListTree
  },
  {
    title: "Products",
    href: "/products",
    icon: Package
  },
  {
    title: "Delivery Zones",
    href: "/delivery-zones",
    icon: Truck
  },
  {
    title: "Delivery Range",
    href: "/delivery-range",
    icon: MapPin
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: QrCode
  }
]

export function RestaurantTabs({ restaurantId }: { restaurantId: string }) {
  const pathname = usePathname()
  const currentTab = pathname.split('/').pop() || ''

  return (
    <Tabs defaultValue={currentTab} className="space-y-4">
      <TabsList>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const href = `/admin/restaurants/${restaurantId}${tab.href}`
          const isActive = pathname === href
          
          return (
            <Link key={tab.href} href={href}>
              <TabsTrigger
                value={tab.href.replace('/', '') || 'dashboard'}
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