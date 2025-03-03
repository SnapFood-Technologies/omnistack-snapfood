// src/app/api/restaurants/[restaurantId]/qr-config/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get QR configuration for a restaurant
export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    
    // Find existing configuration or create default
    let qrConfig = await prisma.qRConfiguration.findFirst({
      where: {
        restaurantId,
      },
    })

    // If no configuration exists, return default values
    if (!qrConfig) {
      return NextResponse.json({
        feeType: 'none',
        isActive: true,
        restaurantId
      })
    }

    return NextResponse.json(qrConfig)
  } catch (error) {
    console.error('Error fetching QR configuration:', error)
    return NextResponse.json(
      { error: "Error fetching QR configuration" }, 
      { status: 500 }
    )
  }
}

// Create or update QR configuration
export async function PUT(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    const body = await req.json()
    
    // Find existing configuration
    const existingConfig = await prisma.qRConfiguration.findFirst({
      where: {
        restaurantId,
      },
    })

    // Create or update configuration
    let qrConfig
    
    if (existingConfig) {
      // Update existing configuration
      qrConfig = await prisma.qRConfiguration.update({
        where: {
          id: existingConfig.id,
        },
        data: {
          feeType: body.feeType,
          feeAmount: body.feeAmount,
          isActive: body.isActive,
        },
      })
    } else {
      // Create new configuration
      qrConfig = await prisma.qRConfiguration.create({
        data: {
          feeType: body.feeType,
          feeAmount: body.feeAmount,
          isActive: body.isActive,
          restaurantId,
        },
      })
    }

    return NextResponse.json({
      success: true,
      qrConfig,
    })
  } catch (error) {
    console.error('Error updating QR configuration:', error)
    return NextResponse.json(
      { error: "Failed to update QR configuration" }, 
      { status: 500 }
    )
  }
}