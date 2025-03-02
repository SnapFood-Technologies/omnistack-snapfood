// app/api/restaurants/sync/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSnapFoodVendorApi } from "@/app/api/external/omnigateway/snapfood-vendor";

export async function POST(req: Request) {
  try {
    // Get API key from environment
    const apiKey = process.env.OMNI_GATEWAY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }
    
    // Use the same API client as the hook
    const snapFoodApi = createSnapFoodVendorApi(apiKey);
    
    // Get vendors using the same function as in the hook
    const response = await snapFoodApi.getVendors({
      per_page: 100 // Get more vendors in one request for efficiency
    });
    
    if (!response.success || !response.data) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch vendors from Snapfood API" },
        { status: 500 }
      );
    }
    
    const vendors = response.data.vendors;
    
    // Sync stats
    let totalVendors = vendors.length;
    let syncedVendors = 0;
    let createdVendors = 0;
    let updatedVendors = 0;
    let errors = [];
    
    // Process each vendor
    for (const vendor of vendors) {
      try {
        // Check if restaurant with this external ID already exists
        const existingRestaurant = await prisma.restaurant.findFirst({
          where: { externalSnapfoodId: vendor.externalSnapfoodId }
        });
        
        if (existingRestaurant) {
          // Update existing restaurant
          await prisma.restaurant.update({
            where: { id: existingRestaurant.id },
            data: {
              name: vendor.name,
              description: vendor.description || existingRestaurant.description,
              address: vendor.address || existingRestaurant.address,
              phone: vendor.phone || existingRestaurant.phone,
              latitude: vendor.latitude || existingRestaurant.latitude ,
              longitude: vendor.latitude || existingRestaurant.latitude ,
              isOpen: vendor.isOpen || existingRestaurant.isOpen,
              lastSyncedAt: new Date()
            }
          });
          
          updatedVendors++;
        } else {
          // Create new restaurant
          await prisma.restaurant.create({
            data: {
              externalSnapfoodId: vendor.externalSnapfoodId,
              name: vendor.name,
              description: vendor.description || "",
              address: vendor.address || "",
              phone: vendor.phone || "",
              latitude: vendor.latitude || "" ,
              longitude: vendor.latitude || "" ,
              isOpen: vendor.isOpen || false,
              email: "",
              status: "ACTIVE",
              lastSyncedAt: new Date()
            }
          });
          
          createdVendors++;
        }
        
        syncedVendors++;
      } catch (error) {
        console.error(`Error processing vendor ${vendor.externalSnapfoodId}:`, error);
        errors.push({
          id: vendor.externalSnapfoodId,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      totalVendors,
      syncedVendors,
      createdVendors,
      updatedVendors,
      errors
    });
    
  } catch (error) {
    console.error("Error syncing restaurants:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error syncing restaurants: " + error.message
      }, 
      { status: 500 }
    );
  }
}