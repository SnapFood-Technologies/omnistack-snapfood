// src/app/api/restaurants/[restaurantId]/qr-codes/[id]/download/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"
import sharp from "sharp"

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string; id: string } }
) {
  try {
    // Get format from query params
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'svg'

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

    // For SVG, return the raw SVG content
    if (format === 'svg') {
      // Make sure logo data URL in the SVG is properly formed
      const svgCode = qrCode.code;
      
      return new NextResponse(svgCode, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.svg"`,
          'Cache-Control': 'no-store'
        }
      })
    } 
    
    // For PNG, convert the SVG to PNG
    if (format === 'png') {
      try {
        // Get dimensions based on size
        const size = qrCode.size === 'large' ? 800 : qrCode.size === 'medium' ? 600 : 400;
        
        // Create a buffer from the SVG string
        const svgBuffer = Buffer.from(qrCode.code);
        
        // Use sharp to convert SVG to PNG with higher quality
        const pngBuffer = await sharp(svgBuffer)
          .resize(size)
          .png({ quality: 100 })
          .toBuffer();
        
        return new NextResponse(pngBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
            'Cache-Control': 'no-store'
          }
        });
      } catch (error) {
        console.error('Error converting SVG to PNG:', error);
        
        // If sharp conversion fails, return an error
        return NextResponse.json(
          { error: "Failed to convert QR code to PNG" },
          { status: 500 }
        );
      }
    }

    // Default response if format is not supported
    return NextResponse.json(
      { error: "Unsupported format. Use 'svg' or 'png'." },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error downloading QR code:', error)
    return NextResponse.json(
      { error: "Error downloading QR code" },
      { status: 500 }
    )
  }
}