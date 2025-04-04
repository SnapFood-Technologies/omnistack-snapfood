// src/app/api/restaurants/[restaurantId]/qr-codes/preview/route.ts
import { NextResponse } from "next/server"
import * as QRCode from "qrcode"

export async function PUT(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    const formData = await req.formData()
    
    // Get QR configuration first to check if it's active
    const qrConfigResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || ''}/api/restaurants/${restaurantId}/qr-config`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!qrConfigResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch QR configuration" },
        { status: 500 }
      )
    }
    
    const qrConfig = await qrConfigResponse.json()
    
    if (!qrConfig.isActive) {
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
    
    const hasLogo = formData.get('hasLogo') === 'true'
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const logoFile = formData.get('logo') as File | null
    const designStyle = formData.get('design') ? String(formData.get('design')) : 'classic'
    const primaryColor = String(formData.get('primaryColor') || '#000000')
    const backgroundColor = String(formData.get('backgroundColor') || '#FFFFFF')
    
    // Get the size with expanded options
    let qrSize = formData.get('size') ? String(formData.get('size')) : 'medium';
    let width;
    
    switch(qrSize) {
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
      errorCorrectionLevel: (formData.get('errorLevel') as 'L' | 'M' | 'Q' | 'H') || 'M',
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
    let qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgSize}" height="${svgSize}">\n`
    
    // Add background
    qrSvg += `<rect width="100%" height="100%" fill="${backgroundColor}" />\n`
    
    // Create QR code according to selected style
    switch (designStyle) {
      case 'dots':
        // Draw circles for each module
        qrSvg += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const cx = (col * tileSize) + (tileSize / 2) + (quietZone * tileSize)
              const cy = (row * tileSize) + (tileSize / 2) + (quietZone * tileSize)
              const radius = tileSize * 0.45 // Slightly smaller than half tile size for spacing
              
              qrSvg += `  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${primaryColor}" />\n`
            }
          }
        }
        qrSvg += `</g>\n`
        break
        
      case 'modern':
        // Draw rounded squares
        qrSvg += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const x = (col * tileSize) + (quietZone * tileSize)
              const y = (row * tileSize) + (quietZone * tileSize)
              const rx = tileSize * 0.25 // Rounded corner radius
              
              qrSvg += `  <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="${rx}" ry="${rx}" fill="${primaryColor}" />\n`
            }
          }
        }
        qrSvg += `</g>\n`
        break
        
      case 'classic':
      default:
        // Draw regular squares
        qrSvg += `<g>\n`
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qrData.modules.get(row, col)) {
              const x = (col * tileSize) + (quietZone * tileSize)
              const y = (row * tileSize) + (quietZone * tileSize)
              
              qrSvg += `  <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" fill="${primaryColor}" />\n`
            }
          }
        }
        qrSvg += `</g>\n`
        break
    }
    
    // Add custom text if provided
    if (customText) {
      const fontSize = tileSize * 2
      qrSvg += `<text
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
        qrSvg += `<rect 
          x="${logoX - 4}"
          y="${logoY - 4}"
          width="${logoSize + 8}"
          height="${logoSize + 8}"
          fill="${backgroundColor}"
        />\n`
        
        // Add the logo with proper data URI format
        qrSvg += `<image
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
    qrSvg += `</svg>`
    
    // Generate PNG version with logo support
    let qrPngDataUrl;
    
    if (hasLogo && logoFile) {
      // For PNG with logo, we'll need to convert SVG to PNG
      const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`;
      qrPngDataUrl = svgDataUrl; // Use SVG data URL as a fallback
      
      // Note: In a client-side context, you'd use canvas to render this
      // On server-side, the download endpoint will handle this properly
    } else {
      // For PNG without logo, we can use QRCode's built-in PNG generation
      qrPngDataUrl = await QRCode.toDataURL(qrUrl, {
        ...qrOptions,
        type: 'image/png',
      });
    }
    
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`;
    
    return NextResponse.json({
      svgString: qrSvg,
      svgDataUrl,
      pngDataUrl: qrPngDataUrl,
    });

  } catch (error: any) {
    console.error('Error generating QR preview:', error);
    return NextResponse.json(
      { error: error.message || "Error generating QR preview" }, 
      { status: 500 }
    );
  }
}