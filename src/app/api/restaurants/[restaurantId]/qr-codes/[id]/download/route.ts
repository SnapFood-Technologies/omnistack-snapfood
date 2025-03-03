// src/app/api/restaurants/[restaurantId]/qr-codes/[id]/download/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"
import sharp from "sharp" // For PNG conversion

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string; id: string } }
) {
  try {
    // Get format from query params
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'svg'

    // Check if QR functionality is enabled
    const qrConfig = await prisma.qRConfiguration.findFirst({
      where: {
        restaurantId: params.restaurantId,
      },
    })

    if (qrConfig && !qrConfig.isActive) {
      return NextResponse.json(
        { error: "QR code functionality is disabled for this restaurant" },
        { status: 403 }
      )
    }

    // Get QR code from database
    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id: params.id,
        restaurantId: params.restaurantId,
      },
      include: {
        menu: true
      }
    })

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR code not found" },
        { status: 404 }
      )
    }

    // Update download count
    await prisma.qRCode.update({
      where: { id: params.id },
      data: { scans: { increment: 1 } },
    })

    if (format === 'png') {
      // Convert SVG to PNG
      const pngBuffer = await sharp(Buffer.from(qrCode.code))
        .resize(qrCode.size === 'large' ? 400 : qrCode.size === 'medium' ? 300 : 200)
        .png()
        .toBuffer()

      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
          'Cache-Control': 'no-store'
        }
      })
    }

    // Return SVG
    return new NextResponse(qrCode.code, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.svg"`,
        'Cache-Control': 'no-store'
      }
    })

  } catch (error) {
    console.log('Error downloading QR code:', error)
    return NextResponse.json(
      { error: "Error downloading QR code" },
      { status: 500 }
    )
  }
}