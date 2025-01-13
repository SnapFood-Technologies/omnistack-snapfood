// src/app/api/restaurants/[restaurantId]/qr-codes/[id]/download/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"
import sharp from "sharp" // Add sharp for PNG conversion

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

export async function POST(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  if (!params?.restaurantId) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    )
  }

  try {
    const formData = await req.formData()
    
    // Generate URL based on menu or custom URL
    const qrUrl = formData.get('customUrl') 
      ? String(formData.get('customUrl'))
      : `${process.env.NEXT_PUBLIC_APP_URL}/menu/${formData.get('menuId')}`

    // QR code generation options
    const qrOptions: QRCode.QRCodeToFileOptions = {
      type: 'svg',
      color: {
        dark: String(formData.get('primaryColor') || '#000000'),
        light: String(formData.get('backgroundColor') || '#FFFFFF'),
      },
      errorCorrectionLevel: (formData.get('errorLevel') as 'L' | 'M' | 'Q' | 'H') || 'M',
      margin: 1,
      width: formData.get('size') === 'large' ? 400 : formData.get('size') === 'medium' ? 300 : 200,
    }

    // Generate QR code as SVG
    const qrSvg = await new Promise<string>((resolve, reject) => {
      QRCode.toString(qrUrl, {
        ...qrOptions,
        type: 'svg'
      }, (err, string) => {
        if (err) reject(err)
        resolve(string)
      })
    })

    // Create QR code record
    const qrCode = await prisma.qRCode.create({
      data: {
        code: qrSvg,
        name: formData.get('customText') ? String(formData.get('customText')) : null,
        design: String(formData.get('design')),
        primaryColor: String(formData.get('primaryColor')),
        backgroundColor: String(formData.get('backgroundColor')),
        size: String(formData.get('size')),
        customText: formData.get('customText') ? String(formData.get('customText')) : null,
        hasLogo: formData.get('hasLogo') === 'true',
        errorLevel: String(formData.get('errorLevel')),
        type: String(formData.get('type')) as 'TABLE' | 'TAKEOUT' | 'SPECIAL',
        tableNumber: formData.get('tableNumber') ? Number(formData.get('tableNumber')) : null,
        menuId: String(formData.get('menuId')),
        restaurantId: params.restaurantId
      },
    })

    return NextResponse.json({
      success: true,
      qrCode,
      svgString: qrSvg
    })

  } catch (error) {
    console.log('Error creating QR code:', error.message)
    return NextResponse.json(
      { error: "Error creating QR code" }, 
      { status: 500 }
    )
  }
}