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
    
    // For PNG, convert the SVG to PNG
    if (format === 'png') {
      try {
        // Get dimensions based on size
        let size = 300; // default medium
        
        switch(qrCode.size) {
          case 'tiny':
            size = 100;
            break;
          case 'small':
            size = 200;
            break;
          case 'medium':
            size = 300;
            break;
          case 'large':
            size = 400;
            break;
          case 'xlarge':
            size = 500;
            break;
          default:
            size = 300;
        }
        
        // Create a buffer from the SVG string
        const svgBuffer = Buffer.from(qrCode.code);
        
        // Use sharp to convert SVG to PNG with higher quality
        // We'll use a higher density to ensure the logo is clear
        const pngBuffer = await sharp(svgBuffer, { 
          density: 300 // Higher density for better quality
        })
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
        
        // If SVG conversion fails, try to generate a new PNG directly using the stored URL
        try {
          if (!qrCode.qrUrl) {
            throw new Error("QR URL not stored in database");
          }
          
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
          
          const pngDataUrl = await QRCode.toDataURL(qrCode.qrUrl, {
            color: {
              dark: qrCode.primaryColor,
              light: qrCode.backgroundColor,
            },
            errorCorrectionLevel: qrCode.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
            margin: 1,
            width: width,
          });
          
          // Convert data URL to buffer
          const pngBuffer = Buffer.from(pngDataUrl.split(',')[1], 'base64');
          
          return new NextResponse(pngBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.png"`,
              'Cache-Control': 'no-store'
            }
          });
        } catch (error) {
          console.error('Fallback PNG generation failed:', error);
          return NextResponse.json(
            { error: "Failed to convert QR code to PNG" },
            { status: 500 }
          );
        }
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