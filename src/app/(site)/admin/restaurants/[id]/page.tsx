// src/app/admin/restaurants/[id]/page.tsx
import { Metadata } from "next"
import { RestaurantDashboardContent } from "@/components/admin/restaurants/dashboard-content"

interface Props {
  params: { id: string }
}

async function getRestaurant(id: string) {
  // Replace with your actual data fetching logic
  // const response = await fetch(`/api/restaurants/${id}`)
  // return response.json()
  
  // Mock data for example
  return {
    name: "Pasta Paradise",
    description: "Authentic Italian cuisine in the heart of the city",
    cuisine: "Italian",
    location: "Downtown"
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const restaurant = await getRestaurant(params.id)
  
  return {
    title: `${restaurant.name} - Restaurant Dashboard - Snapfood Admin`,
    description: `Manage ${restaurant.name}'s operations, menu, and delivery services. ${restaurant.cuisine} restaurant located in ${restaurant.location}.`,
    openGraph: {
      title: `${restaurant.name} - Restaurant Management`,
      description: restaurant.description,
      type: 'website',
      // images: [{ url: restaurant.image }], // If you have restaurant images
    },
    twitter: {
      card: 'summary_large_image',
      title: `${restaurant.name} - Restaurant Dashboard`,
      description: `Management dashboard for ${restaurant.name} - ${restaurant.cuisine} cuisine`,
    },
  }
}

export default function RestaurantDashboardPage() {
  return (
      <div>
          <RestaurantDashboardContent />
      </div>
  )
}