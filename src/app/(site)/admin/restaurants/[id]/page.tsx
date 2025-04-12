// src/app/(site)/admin/restaurants/[id]/page.tsx
import { Metadata } from "next"
import { RestaurantDashboardContent } from "@/components/admin/restaurants/dashboard-content"

interface Props {
  params: Promise<{ id: string }> | { id: string }
}

export default async function RestaurantDashboardPage({ params }: Props) {
  // Await the params object itself
  const resolvedParams = await params;
  
  return (
    <div>
      <RestaurantDashboardContent id={resolvedParams.id} />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params object itself
  const resolvedParams = await params;
  
  return {
    title: `Restaurant Dashboard - SnapFood Admin`,
    description: `Manage restaurant operations, menu, and delivery services.`,
  }
}