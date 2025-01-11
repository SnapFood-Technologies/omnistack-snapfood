// app/(site)/admin/restaurants/[id]/layout.tsx
import { RestaurantTabs } from "@/components/admin/restaurants/tabs"

export default function RestaurantLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Pasta Paradise</h2>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant details, menu, and delivery settings
        </p>
      </div>
      
      <RestaurantTabs restaurantId={params.id} />
      
      {children}
    </div>
  )
}