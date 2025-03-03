// src/app/(site)/admin/restaurants/[id]/layout.tsx
import { RestaurantTabs } from "@/components/admin/restaurants/tabs"

export default async function RestaurantLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }> | { id: string }
}) {
  // Await the params object itself
  const resolvedParams = await params;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Restaurant Details</h2>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant details, menu, and delivery settings
        </p>
      </div>
      
      <RestaurantTabs restaurantId={resolvedParams.id} />
      
      {children}
    </div>
  )
}