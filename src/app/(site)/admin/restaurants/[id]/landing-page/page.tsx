// src/app/admin/restaurants/[id]/landing-page/page.tsx
import { Metadata } from "next"
import { LandingPageEditor } from "@/components/admin/restaurants/LandingPageEditor"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

async function getRestaurant(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  })
  
  if (!restaurant) {
    notFound()
  }
  
  return restaurant
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const restaurant = await getRestaurant(resolvedParams.id);
  return {
    title: `Landing Page - ${restaurant.name} - SnapFood Admin`,
    description: `Customize landing page for ${restaurant.name}'s QR codes.`,
  }
}

export default async function LandingPageEditorPage({ params }: Props) {
  // Await the params object
  const resolvedParams = await params;
  const restaurant = await getRestaurant(resolvedParams.id);
  
  return (
    <div className="space-y-8">
      <LandingPageEditor restaurantId={resolvedParams.id} restaurant={restaurant} />
      </div>
  )
}