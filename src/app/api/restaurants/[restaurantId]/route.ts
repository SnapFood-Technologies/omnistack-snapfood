// src/app/api/restaurants/[restaurantId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> | { restaurantId: string } }
) {
  try {
    // Await the params object
    const resolvedParams = await params;
    
    // Get restaurant data from the database
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: resolvedParams.restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant data" },
      { status: 500 }
    );
  }
}