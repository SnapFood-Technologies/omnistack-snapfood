// src/app/api/restaurants/[restaurantId]/qr-codes/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as QRCode from "qrcode"

export async function POST(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params

    // Get QR configuration first to check if it's active
    const qrConfig = await prisma.qRConfiguration.findFirst({
      where: { restaurantId },
    })

    if (qrConfig && !qrConfig.isActive) {
      return NextResponse.json(
        { error: "QR code functionality is disabled for this restaurant" },
        { status: 403 }
      )
    }

    const formData = await req.formData()

    // Get the QR URL directly from the form data
    const qrUrl = formData.get('qrUrl') ? String(formData.get('qrUrl')) : '';
    
    if (!qrUrl) {
      return NextResponse.json(
        { error: "No URL provided for QR code" },
        { status: 400 }
      )
    }

    // Extract form data
    const design = formData.get('design') ? String(formData.get('design')) : 'classic'
    const type = formData.get('type') ? String(formData.get('type')) : 'PROFILE_WEB'
    const primaryColor = formData.get('primaryColor') ? String(formData.get('primaryColor')) : '#000000'
    const backgroundColor = formData.get('backgroundColor') ? String(formData.get('backgroundColor')) : '#FFFFFF'
    const size = formData.get('size') ? String(formData.get('size')) : 'medium'
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const hasLogo = formData.get('hasLogo') === 'true'
    const errorCorrectionLevel = formData.get('errorCorrectionLevel') ? String(formData.get('errorCorrectionLevel')) : 'M'
    const logoFile = formData.get('logo') as File | null
    const menuId = formData.get('menuId') ? String(formData.get('menuId')) : null
    const tableNumber = formData.get('tableNumber') ? Number(formData.get('tableNumber')) : null
    const qrFlow = formData.get('qrFlow') ? String(formData.get('qrFlow')) : 'IN_APP_ONLY' // Get QR flow

    // Get the width based on the size
    let width;
    switch(size) {
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
        width = 300; // Default to medium
    }

    // QR code generation options
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      type: 'svg',
      color: {
        dark: primaryColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
      margin: 1,
      width: width,
    }

    // Get QR code data matrix
    const qrData = QRCode.create(qrUrl, {
      errorCorrectionLevel: qrOptions.errorCorrectionLevel as any
    })
    
    // Size calculation
    const moduleCount = qrData.modules.size
    const tileSize = width / moduleCount
    const quietZone = qrOptions.margin || 4
    const svgSize = width + (quietZone * 2 * tileSize)
    
    // Create SVG
    let viewBox = `0 0 ${svgSize} ${svgSize}`
    
    // Extend height for custom text if needed
    let textY = 0
    if (customText) {
      textY = svgSize + 40
      viewBox = `0 0 ${svgSize} ${textY}`
    }
    
    // Start SVG
    let code = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgSize}" height="${svgSize}">\n`
    
    // Add background
    code += `<rect width="100%" height="100%" fill="${backgroundColor}" />\n`
    
    // Create QR code according to selected style
    switch (design) {
      case 'dots':
        // Draw circles for each module
        code += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const cx = (col * tileSize) + (tileSize / 2) + (quietZone * tileSize)
              const cy = (row * tileSize) + (tileSize / 2) + (quietZone * tileSize)
              const radius = tileSize * 0.45 // Slightly smaller than half tile size for spacing
              
              code += `  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${primaryColor}" />\n`
            }
          }
        }
        code += `</g>\n`
        break
        
      case 'modern':
        // Draw rounded squares
        code += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const x = (col * tileSize) + (quietZone * tileSize)
              const y = (row * tileSize) + (quietZone * tileSize)
              const rx = tileSize * 0.25 // Rounded corner radius
              
              code += `  <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="${rx}" ry="${rx}" fill="${primaryColor}" />\n`
            }
          }
        }
        code += `</g>\n`
        break
        
      case 'classic':
      default:
        // Draw regular squares
        code += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const x = (col * tileSize) + (quietZone * tileSize)
              const y = (row * tileSize) + (quietZone * tileSize)
              
              code += `  <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" fill="${primaryColor}" />\n`
            }
          }
        }
        code += `</g>\n`
        break
    }
    
    // Add custom text if provided
    if (customText) {
      const fontSize = tileSize * 2
      code += `<text
        x="${svgSize / 2}"
        y="${svgSize + 25}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${fontSize}px"
        fill="${primaryColor}"
      >${customText}</text>\n`
    }
    
    // Add logo if enabled and provided
    if (hasLogo && logoFile) {
      try {
        // Convert logo to base64
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer())
        const logoBase64 = logoBuffer.toString('base64')
        const logoMimeType = logoFile.type || 'image/png' // Default to PNG if type is missing
        
        // Calculate logo size (20% of the QR code size for better visibility)
        const logoSize = svgSize * 0.2
        const logoX = (svgSize - logoSize) / 2
        const logoY = (svgSize - logoSize) / 2
        
        // Add white background for logo
        code += `<rect 
          x="${logoX - 4}"
          y="${logoY - 4}"
          width="${logoSize + 8}"
          height="${logoSize + 8}"
          fill="${backgroundColor}"
        />\n`
        
        // Add the logo with proper data URI format
        code += `<image
          x="${logoX}"
          y="${logoY}"
          width="${logoSize}"
          height="${logoSize}"
          preserveAspectRatio="xMidYMid meet"
          href="data:${logoMimeType};base64,${logoBase64}"
        />\n`
      } catch (error) {
        console.error('Error processing logo:', error)
      }
    }
    
    // Close SVG
    code += `</svg>`

    // Save QR code to database
    const newQrCode = await prisma.qRCode.create({
      data: {
        code,
        design,
        type,
        primaryColor,
        backgroundColor,
        size,
        customText,
        hasLogo,
        errorCorrectionLevel,
        restaurantId,
        menuId,
        tableNumber,
        isActive: true,
        qrUrl, // Store the URL
        qrFlow, // Store the QR flow type
      },
    })

    // Generate SVG and PNG data URLs for immediate use
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(code).toString('base64')}`;
    
    // Generate PNG data URL
    let pngDataUrl;
    
    if (hasLogo && logoFile) {
      // For PNG with logo, use the SVG data URL as a fallback
      // The actual PNG will be properly generated when downloaded
      pngDataUrl = svgDataUrl;
    } else {
      // For PNG without logo, we can use QRCode's built-in PNG generation
      pngDataUrl = await QRCode.toDataURL(qrUrl, {
        ...qrOptions,
        type: 'image/png',
      });
    }

    return NextResponse.json({
      id: newQrCode.id,
      success: true,
      message: "QR code generated successfully",
      svgString: code,
      svgDataUrl,
      pngDataUrl,
    })
  } catch (error: any) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: error.message || "Failed to generate QR code" },
      { status: 500 }
    )
  }
}