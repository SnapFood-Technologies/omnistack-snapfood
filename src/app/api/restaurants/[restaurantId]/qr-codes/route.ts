import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        restaurantId: params.restaurantId,
      },
      include: {
        menu: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(qrCodes)
  } catch (error) {
    console.log('Error fetching QR codes:', error)
    return NextResponse.json(
      { error: "Error fetching QR codes" }, 
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const formData = await req.formData()
    
    // Generate URL based on menu or custom URL
    const customUrl = formData.get('customUrl') ? String(formData.get('customUrl')) : null
    const menuId = formData.get('menuId') ? String(formData.get('menuId')) : null
    const hasLogo = formData.get('hasLogo') === 'true'
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const logoFile = formData.get('logo') as File | null

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const qrUrl = customUrl
      ? customUrl
      : menuId
      ? `${baseUrl}/menu/${menuId}`
      : `${baseUrl}` // Fallback URL if neither customUrl nor menuId is provided

    // QR code generation options
    const qrOptions: QRCode.QRCodeToStringOptions = {
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
    let qrSvg = await QRCode.toString(qrUrl, qrOptions)

    // Add custom text if provided
    if (customText) {
      const textY = qrOptions.width + 30 // Position text below QR code
      qrSvg = qrSvg.replace('</svg>', `
        <text
          x="50%"
          y="${textY}"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="14"
          fill="${qrOptions.color.dark}"
        >${customText}</text>
      </svg>`)
    }

    // Add logo if enabled and provided
    if (hasLogo && logoFile) {
      try {
        // Convert logo to base64
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer())
        const logoBase64 = logoBuffer.toString('base64')
        const logoMimeType = logoFile.type
        
        // Calculate logo size (20% of QR code size)
        const logoSize = Math.floor(qrOptions.width * 0.2)
        const logoX = Math.floor((qrOptions.width - logoSize) / 2)
        const logoY = Math.floor((qrOptions.width - logoSize) / 2)

        // Insert logo in the center
        qrSvg = qrSvg.replace('</svg>', `
          <image
            x="${logoX}"
            y="${logoY}"
            width="${logoSize}"
            height="${logoSize}"
            href="data:${logoMimeType};base64,${logoBase64}"
          />
        </svg>`)
      } catch (error) {
        console.error('Error processing logo:', error)
      }
    }

    // Create QR code record
    const qrCode = await prisma.qRCode.create({
      data: {
        code: qrSvg,
        name: customText,
        design: String(formData.get('design')),
        primaryColor: String(formData.get('primaryColor')),
        backgroundColor: String(formData.get('backgroundColor')),
        size: String(formData.get('size')),
        customText: customText,
        hasLogo: hasLogo,
        errorCorrectionLevel: String(formData.get('errorLevel')),
        type: String(formData.get('type')) as 'TABLE' | 'TAKEOUT' | 'SPECIAL',
        tableNumber: formData.get('tableNumber') ? Number(formData.get('tableNumber')) : null,
        menuId: menuId,
        restaurantId: params.restaurantId
      },
    })

    return NextResponse.json({
      success: true,
      qrCode,
      svgString: qrSvg
    })

  } catch (error) {
    console.log('error.message', error)
    return NextResponse.json(
      { error: "Failed to generate QR code" }, 
      { status: 500 }
    )
  }
}