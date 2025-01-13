import { NextResponse } from "next/server"
import * as QRCode from "qrcode"

export async function PUT(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const formData = await req.formData()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const customUrl = formData.get('customUrl') ? String(formData.get('customUrl')) : null
    const menuId = formData.get('menuId') ? String(formData.get('menuId')) : null
    const hasLogo = formData.get('hasLogo') === 'true'
    const customText = formData.get('customText') ? String(formData.get('customText')) : null
    const logoFile = formData.get('logo') as File | null

    const qrUrl = customUrl
      ? customUrl
      : menuId
      ? `${baseUrl}/menu/${menuId}`
      : `${baseUrl}`

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

    // Generate PNG version
    const qrPngDataUrl = await QRCode.toDataURL(qrUrl, {
      ...qrOptions,
      type: 'png',
    })

    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`

    return NextResponse.json({
      svgString: qrSvg,
      svgDataUrl,
      pngDataUrl: qrPngDataUrl,
    })

  } catch (error: any) {
    console.error('Error generating QR preview:', error)
    return NextResponse.json(
      { error: error.message || "Error generating QR preview" }, 
      { status: 500 }
    )
  }
}