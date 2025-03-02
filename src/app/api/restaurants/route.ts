// app/api/restaurants/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    
    // Calculate pagination
    const skip = (page - 1) * pageSize;
    
    // Build search filter
    const searchFilter = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ],
    } : {};
    
    // Query restaurants with filters and pagination
    const restaurants = await prisma.restaurant.findMany({
      where: searchFilter,
      orderBy: { lastSyncedAt: 'desc' },
      skip,
      take: pageSize,
    });
    
    // Get total count for pagination
    const totalRestaurants = await prisma.restaurant.count({
      where: searchFilter,
    });
    
    const totalPages = Math.ceil(totalRestaurants / pageSize);
    
    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalItems: totalRestaurants,
      }
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}