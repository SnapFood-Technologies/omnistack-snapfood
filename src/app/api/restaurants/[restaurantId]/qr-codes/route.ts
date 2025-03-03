// src/app/api/restaurants/[restaurantId]/qr-codes/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    // Check if QR functionality is enabled
    const qrConfig = await prisma.qRConfiguration.findFirst({
      where: {
        restaurantId: params.restaurantId,
      },
    })

    // If QR functionality is disabled, return empty list with a status flag
    if (qrConfig && !qrConfig.isActive) {
      return NextResponse.json({
        qrCodes: [],
        isActive: false
      })
    }

    // Fetch QR codes
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

    return NextResponse.json({
      qrCodes,
      isActive: true
    })
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

    const formData = await req.formData()
    
    // Extract data from form
    const customUrl = formData.get('customUrl') ? String(formData.get('customUrl')) : null
    const menuId = formData.get('menuId') ? String(formData.get('menuId')) : null
    const hasLogo = formData.get('hasLogo') === 'true'
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const logoFile = formData.get('logo') as File | null

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create QR URL based on configuration
    let qrUrl: string
    
    if (customUrl) {
      qrUrl = customUrl
    } else if (menuId) {
      // Use URL structure based on QR configuration
      if (qrConfig?.qrType === 'app_with_google') {
        qrUrl = `${baseUrl}/menu/${menuId}?ref=google`
      } else {
        qrUrl = `${baseUrl}/menu/${menuId}`
      }
    } else {
      qrUrl = baseUrl
    }

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

    // Find and possibly modify the viewBox
    const viewBoxMatch = qrSvg.match(/viewBox="([^"]*)"/)
    if (viewBoxMatch) {
      const [x, y, width, height] = viewBoxMatch[1].split(' ').map(Number)
      // Extend the height if we have custom text
      const newHeight = customText ? height + 40 : height
      const newViewBox = `${x} ${y} ${width} ${newHeight}`
      qrSvg = qrSvg.replace(/viewBox="([^"]*)"/, `viewBox="${newViewBox}"`)
    }

    // Add custom text if provided
    if (customText) {
      const textY = qrOptions.width + 25 // Position text below QR code
      qrSvg = qrSvg.replace('</svg>', `
        <text
          x="50%"
          y="${textY}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
          font-size="${qrOptions.width * 0.05}px"
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
        
        // Find the viewBox dimensions again (might have changed due to text)
        const currentViewBox = qrSvg.match(/viewBox="([^"]*)"/)
        if (currentViewBox) {
          const [x, y, width, height] = currentViewBox[1].split(' ').map(Number)
          
          // Calculate logo size (15% of the smaller dimension)
          const logoSize = Math.min(width, height) * 0.15
          const logoX = (width - logoSize) / 2
          const logoY = (height - logoSize) / 2

          // Create white background for logo and add the logo
          qrSvg = qrSvg.replace('</svg>', `
            <rect 
              x="${logoX - 2}"
              y="${logoY - 2}"
              width="${logoSize + 4}"
              height="${logoSize + 4}"
              fill="${qrOptions.color.light}"
            />
            <image
              x="${logoX}"
              y="${logoY}"
              width="${logoSize}"
              height="${logoSize}"
              preserveAspectRatio="xMidYMid meet"
              href="data:${logoMimeType};base64,${logoBase64}"
            />
          </svg>`)
        }
      } catch (error) {
        console.error('Error processing logo:', error)
      }
    }

    // Apply fee tracking parameters if applicable
    if (qrConfig?.feeType !== 'none' && qrConfig?.feeAmount) {
      // Add a tracking parameter to the QR content to indicate fee should be applied
      const feeTrackingId = `ft-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      
      // Let's add a metadata comment in the SVG to track this
      qrSvg = qrSvg.replace('<svg ', `<svg data-fee-tracking="${feeTrackingId}" data-fee-type="${qrConfig.feeType}" data-fee-amount="${qrConfig.feeAmount}" `)
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
        type: customUrl ? 'SPECIAL' : String(formData.get('type')) as 'TABLE' | 'TAKEOUT' | 'SPECIAL',
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

  } catch (error: any) {
    console.log('Error creating QR code:', error)
    return NextResponse.json(
      { error: error.message || "Failed to generate QR code" }, 
      { status: 500 }
    )
  }
}