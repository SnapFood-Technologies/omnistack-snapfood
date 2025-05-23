// src/app/api/restaurants/[restaurantId]/menus/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ restaurantId?: string }> | { restaurantId?: string } }
) {
  try {
    // Await the params object
    const resolvedParams = await params;
    
    // If no restaurantId is provided, return empty array
    if (!resolvedParams?.restaurantId) {
      return NextResponse.json([])
    }

    const menus = await prisma.menu.findMany({
      where: {
        restaurantId: resolvedParams.restaurantId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        isDefault: true,
        isActive: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                description: true,
                products: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                    isAvailable: true
                  }
                }
              }
            },
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(menus)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching menus" },
      { status: 500 }
    )
  }
}