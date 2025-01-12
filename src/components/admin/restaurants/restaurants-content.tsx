// components/admin/restaurants/restaurants-content.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Restaurant {
  id: string
  title: string
  openedFrom: string
  openedTo: string
  isOpened: boolean
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isExclusive: boolean
  isGrocery: boolean
  canOrderSchedule: boolean
  canGiftOrder: boolean
  hasFreeDelivery: boolean
  partner: string
  country: string
}

// Dummy data based on the screenshot
const dummyRestaurants: Restaurant[] = [
  {
    id: "349",
    title: "Te Komuna",
    openedFrom: "12:00 AM",
    openedTo: "12:00 AM",
    isOpened: false,
    isActive: true,
    isFeatured: true,
    isNew: true,
    isExclusive: true,
    isGrocery: false,
    canOrderSchedule: true,
    canGiftOrder: false,
    hasFreeDelivery: false,
    partner: "Te Komuna",
    country: "Shqiperi",
  },
  {
    id: "348",
    title: "Gusta La Puglia",
    openedFrom: "12:00 AM",
    openedTo: "12:00 AM",
    isOpened: false,
    isActive: true,
    isFeatured: true,
    isNew: true,
    isExclusive: false,
    isGrocery: false,
    canOrderSchedule: true,
    canGiftOrder: false,
    hasFreeDelivery: false,
    partner: "Gusta La Puglia",
    country: "Shqiperi",
  },
  {
    id: "347",
    title: "Pizza Gigo",
    openedFrom: "12:00 AM",
    openedTo: "12:00 AM",
    isOpened: false,
    isActive: true,
    isFeatured: true,
    isNew: true,
    isExclusive: false,
    isGrocery: false,
    canOrderSchedule: true,
    canGiftOrder: false,
    hasFreeDelivery: false,
    partner: "Pizza Gigo",
    country: "Shqiperi",
  }
]

export function RestaurantsContent() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(dummyRestaurants)
  const router = useRouter()

  
  const columns = [
    {
      header: "Nr",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "title",
    },
    {
      header: "Opened From",
      accessorKey: "openedFrom",
    },
    {
      header: "Opened To",
      accessorKey: "openedTo",
    },
    {
      header: "Is Opened",
      accessorKey: "isOpened",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-20 text-center justify-center",
            !row.isOpened 
              ? "bg-red-100 text-red-700 hover:bg-red-100" 
              : "bg-green-100 text-green-700 hover:bg-green-100"
          )}
        >
          {row.isOpened ? "Open" : "Closed"}
        </Badge>
      ),
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.isActive ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Is Featured",
      accessorKey: "isFeatured",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.isFeatured ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.isFeatured ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Is New",
      accessorKey: "isNew",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.isNew ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.isNew ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Is Exclusive",
      accessorKey: "isExclusive",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.isExclusive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.isExclusive ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Is Grocery",
      accessorKey: "isGrocery",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.isGrocery ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.isGrocery ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Can Order Schedule",
      accessorKey: "canOrderSchedule",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.canOrderSchedule ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.canOrderSchedule ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Can Gift Order",
      accessorKey: "canGiftOrder",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.canGiftOrder ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.canGiftOrder ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Has Free Delivery",
      accessorKey: "hasFreeDelivery",
      cell: (row: any) => (
        <Badge 
          className={cn(
            "px-2 py-0.5 w-16 text-center justify-center",
            row.hasFreeDelivery ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}
        >
          {row.hasFreeDelivery ? "On" : "Off"}
        </Badge>
      ),
    },
    {
      header: "Partner",
      accessorKey: "partner",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant partners and their settings
        </p>
      </div>

      {/* Restaurants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="mb-[-2px]">All Restaurants</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor all restaurant partners
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={restaurants}
            columns={columns}
            onView={(restaurant) => router.push(`/admin/restaurants/${restaurant.id}`)}
            onEdit={(restaurant) => router.push(`/admin/restaurants/${restaurant.id}`)}
            onDelete={(restaurant) => console.log('Delete restaurant:', restaurant)}
          />
        </CardContent>
      </Card>
    </div>
  )
}