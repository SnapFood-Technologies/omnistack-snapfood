// src/app/api/restaurants/[restaurantId]/qr-codes/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        restaurantId,
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
    const { restaurantId } = params;
    const formData = await req.formData()
    
    // Check if QR functionality is enabled
    const qrConfig = await prisma.qRConfiguration.findFirst({
      where: {
        restaurantId,
      },
    })

    if (qrConfig && !qrConfig.isActive) {
      return NextResponse.json(
        { error: "QR code functionality is disabled for this restaurant" },
        { status: 403 }
      )
    }
    
    // Get the QR URL directly from the form data
    const qrUrl = formData.get('qrUrl') ? String(formData.get('qrUrl')) : '';
    
    if (!qrUrl) {
      return NextResponse.json(
        { error: "No URL provided for QR code" },
        { status: 400 }
      )
    }
    
    // Extract form data
    const design = String(formData.get('design') || 'classic')
    const type = String(formData.get('type') || 'PROFILE_WEB')
    const primaryColor = String(formData.get('primaryColor') || '#000000')
    const backgroundColor = String(formData.get('backgroundColor') || '#FFFFFF') 
    const size = String(formData.get('size') || 'medium')
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const hasLogo = formData.get('hasLogo') === 'true'
    const errorLevel = String(formData.get('errorLevel') || 'M')
    const logoFile = formData.get('logo') as File | null
    // Get QR flow if present (for storage only)
    const qrFlow = formData.get('qrFlow') ? String(formData.get('qrFlow')) : 'IN_APP_ONLY'
    
    // QR code generation options
    const qrOptions: QRCode.QRCodeToStringOptions = {
      type: 'svg',
      color: {
        dark: primaryColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
      margin: 1,
      width: size === 'large' ? 400 : size === 'medium' ? 300 : 200,
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

    // Add hidden metadata about the URL in the SVG
    qrSvg = qrSvg.replace('<svg ', `<svg data-qr-url="${qrUrl}" `)

    // Create QR code record
    const qrCode = await prisma.qRCode.create({
      data: {
        code: qrSvg,
        name: customText,
        design,
        type,
        primaryColor,
        backgroundColor,
        size,
        customText,
        hasLogo,
        errorCorrectionLevel: errorLevel,
        restaurantId,
        qrFlow, // Store the QR flow selection
      },
    })

    return NextResponse.json({
      success: true,
      qrCode,
      svgString: qrSvg
    })

  } catch (error) {
    console.log('Error creating QR code:', error)
    return NextResponse.json(
      { error: "Failed to generate QR code" }, 
      { status: 500 }
    )
  }
}