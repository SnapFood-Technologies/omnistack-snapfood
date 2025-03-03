// src/app/admin/restaurants/[id]/qr-codes/page.tsx
import { Metadata } from "next"
import { QRCodeContent } from "@/components/admin/restaurants/qr-codes/qr-content"
import { QRConfiguration } from "@/components/admin/restaurants/qr-codes/qr-configuration"
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
  const restaurant = await getRestaurant(params.id)
  
  return {
    title: `QR Codes - ${restaurant.name} - SnapFood Admin`,
    description: `Generate and manage QR codes for ${restaurant.name}'s menu and services.`,
  }
}

export default async function QRCodesPage({ params }: Props) {
  const restaurant = await getRestaurant(params.id)
  
  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <QRConfiguration restaurantId={params.id} />
      
      {/* Your existing QR code content */}
      <QRCodeContent restaurantId={params.id} />
    </div>
  )
}