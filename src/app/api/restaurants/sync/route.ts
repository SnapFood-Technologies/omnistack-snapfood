import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSnapFoodVendorApi } from "@/app/api/external/omnigateway/snapfood-vendor";

export async function POST(req: Request) {
  try {
    // Get API key
    const apiKey = 'sk_f37b183bf20e3bdf9c5ed0a7cc96428d57915bf132caaf96296a0be008cc2994';
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }
    
    // Create the API client
    const snapFoodApi = createSnapFoodVendorApi(apiKey);
    
    // Get vendors 
    const response = await snapFoodApi.getVendors({
      per_page: 350 // Get more vendors in one request for efficiency
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
    let errors: Array<{ id: string | number; error: string }> = [];
    
    // Process vendors concurrently using Promise.all
    const vendorPromises = vendors.map(async (vendor) => {
      try {
        const vendorId = Number(vendor.externalSnapfoodId);
        if (isNaN(vendorId)) {
          errors.push({
            id: vendor.externalSnapfoodId,
            error: `Invalid vendor ID format: ${vendor.externalSnapfoodId}`
          });
          return;
        }
        
        // Check if restaurant already exists
        const existingRestaurant = await prisma.restaurant.findFirst({
          where: { externalSnapfoodId: vendorId }
        });
        
        // Convert coordinates to numbers if needed
        const latitude = Number(vendor.latitude) || 0;
        const longitude = Number(vendor.longitude) || 0;
        
        if (existingRestaurant) {
          // Update existing restaurant
          await prisma.restaurant.update({
            where: { id: existingRestaurant.id },
            data: {
              name: vendor.name,
              description: vendor.description || existingRestaurant.description,
              address: vendor.address || existingRestaurant.address,
              phone: vendor.phone || existingRestaurant.phone,
              latitude,
              longitude,
              isOpen: vendor.open !== undefined ? vendor.open : existingRestaurant.isOpen,
              isActive: vendor.isActive !== undefined ? vendor.isActive : existingRestaurant.isActive,
              slug: vendor.slug || existingRestaurant.slug,
              hashId: vendor.hash_id || existingRestaurant.hashId,
              lastSyncedAt: new Date()
            }
          });
          updatedVendors++;
        } else {
          // Create new restaurant
          await prisma.restaurant.create({
            data: {
              externalSnapfoodId: vendorId,
              name: vendor.name,
              description: vendor.description || "",
              address: vendor.address || "",
              phone: vendor.phone || "",
              slug: vendor.slug || "",
              hashId: vendor.hash_id || "",
              latitude,
              longitude,
              isOpen: vendor.open !== undefined ? vendor.open : false,
              isActive: vendor.isActive !== undefined ? vendor.isActive : false,
              email: "",
              status: "ACTIVE",
              lastSyncedAt: new Date()
            }
          });
          createdVendors++;
        }
        
        syncedVendors++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push({
          id: vendor?.externalSnapfoodId,
          error: errorMsg
        });
      }
    });
    
    // Wait for all vendor operations to finish
    await Promise.all(vendorPromises);
    
    return NextResponse.json({
      success: true,
      totalVendors,
      syncedVendors,
      createdVendors,
      updatedVendors,
      errors
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error syncing restaurants: " + errorMessage
      }, 
      { status: 500 }
    );
  }
}
