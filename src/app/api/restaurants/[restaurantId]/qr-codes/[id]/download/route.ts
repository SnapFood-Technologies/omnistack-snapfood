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

    // Return SVG as is - it includes the logo if one was used
    if (format === 'svg') {
      return new NextResponse(qrCode.code, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.svg"`,
          'Cache-Control': 'no-store'
        }
      })
    }
    
    // For PNG, we need to make sure we're properly converting the SVG with the embedded logo
    if (format === 'png') {
      try {
        // Convert SVG to PNG with proper SVG handling
        const size = qrCode.size === 'large' ? 400 : qrCode.size === 'medium' ? 300 : 200;
        
        // Use the SVG string directly with sharp
        const pngBuffer = await sharp(Buffer.from(qrCode.code))
          .resize(size * 2) // Higher resolution for better quality
          .png()
          .toBuffer()

        return new NextResponse(pngBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
            'Cache-Control': 'no-store'
          }
        })
      } catch (error) {
        console.error('Error converting SVG to PNG:', error)
        
        // Fallback to direct QR code generation without logo if conversion fails
        const qrUrl = ""; // You need to store the URL in your QR code model
        const pngDataUrl = await QRCode.toDataURL(qrUrl, {
          color: {
            dark: qrCode.primaryColor,
            light: qrCode.backgroundColor,
          },
          errorCorrectionLevel: qrCode.errorCorrectionLevel as any,
          margin: 1,
          width: qrCode.size === 'large' ? 400 : qrCode.size === 'medium' ? 300 : 200,
        });
        
        // Convert data URL to buffer
        const pngBuffer = Buffer.from(pngDataUrl.split(',')[1], 'base64');
        
        return new NextResponse(pngBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
            'Cache-Control': 'no-store'
          }
        })
      }
    }

    // Default to SVG if format is not recognized
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