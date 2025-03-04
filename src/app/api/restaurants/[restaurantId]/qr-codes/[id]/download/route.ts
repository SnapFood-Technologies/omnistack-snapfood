// src/app/api/restaurants/[restaurantId]/qr-codes/[id]/download/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as QRCode from "qrcode";
import sharp from "sharp";

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string; id: string } }
) {
  try {
    // Get format from query params
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'svg';

    // Get QR code from database
    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id: params.id,
        restaurantId: params.restaurantId,
      },
      include: {
        menu: true
      }
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR code not found" },
        { status: 404 }
      );
    }

    // Update download count
    await prisma.qRCode.update({
      where: { id: params.id },
      data: { scans: { increment: 1 } },
    });

    // For SVG, return the raw SVG content
    if (format === 'svg') {
      const svgCode = qrCode.code;
      
      return new NextResponse(svgCode, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.svg"`,
          'Cache-Control': 'no-store'
        }
      });
    } 
    
    // For PNG, we need to regenerate it to ensure it's valid
    if (format === 'png') {
      try {
        // If we have a stored URL, generate a fresh PNG from scratch
        if (qrCode.qrUrl) {
          // Get dimensions based on size
          let width = 300; // default medium
          
          switch(qrCode.size) {
            case 'tiny':
              width = 100;
              break;
            case 'small':
              width = 200;
              break;
            case 'medium':
              width = 300;
              break;
            case 'large':
              width = 400;
              break;
            case 'xlarge':
              width = 500;
              break;
            default:
              width = 300;
          }
          
          // Generate a completely new PNG using QRCode library
          const pngBuffer = await QRCode.toBuffer(qrCode.qrUrl, {
            type: 'png',
            color: {
              dark: qrCode.primaryColor,
              light: qrCode.backgroundColor,
            },
            errorCorrectionLevel: qrCode.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
            margin: 1,
            width: width,
            scale: 1,
          });
          
          return new NextResponse(pngBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
              'Cache-Control': 'no-store'
            }
          });
        } else {
          // If URL isn't stored, try converting the SVG to PNG as fallback
          const svgBuffer = Buffer.from(qrCode.code);
          const pngBuffer = await sharp(svgBuffer, { density: 300 })
            .png()
            .toBuffer();
          
          return new NextResponse(pngBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
              'Cache-Control': 'no-store'
            }
          });
        }
      } catch (error) {
        console.error('Error generating PNG:', error);
        
        // Return a meaningful error message
        return NextResponse.json(
          { error: "Failed to generate PNG version of QR code" },
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
    console.error('Error downloading QR code:', error);
    return NextResponse.json(
      { error: "Error downloading QR code" },
      { status: 500 }
    );
  }
}