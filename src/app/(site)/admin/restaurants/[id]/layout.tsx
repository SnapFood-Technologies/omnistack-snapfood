// src/app/admin/restaurants/[id]/layout.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
// import { usePathname } from "next/navigation"

const TABS = [
  {
    title: "Dashboard",
    href: "",
    icon: "📊"
  },
  {
    title: "Menu",
    href: "/menu",
    icon: "🍽️"
  },
  {
    title: "Categories",
    href: "/categories",
    icon: "📑"
  },
  {
    title: "Products",
    href: "/products",
    icon: "🛍️"
  },
  {
    title: "Delivery Zones",
    href: "/delivery-zones",
    icon: "🚚"
  },
  {
    title: "Delivery Range",
    href: "/delivery-range",
    icon: "📍"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "⚙️"
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: "📱"
  }
]

export default function RestaurantLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Restaurant Management</h2>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          {TABS.map((tab) => (
            <Link key={tab.href} href={`/admin/restaurants/${params.id}${tab.href}`}>
              <TabsTrigger value={tab.title.toLowerCase()} className="flex items-center gap-2">
                <span>{tab.icon}</span>
                {tab.title}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}