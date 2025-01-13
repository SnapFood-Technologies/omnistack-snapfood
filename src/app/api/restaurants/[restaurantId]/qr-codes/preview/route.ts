import { NextResponse } from "next/server"
import * as QRCode from "qrcode"

// Add preview endpoint
export async function PUT(
    req: Request,
    { params }: { params: { restaurantId: string } }
  ) {
    try {
      const formData = await req.formData()
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
      const customUrl = formData.get('customUrl') ? String(formData.get('customUrl')) : null
      const menuId = formData.get('menuId') ? String(formData.get('menuId')) : null
  
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
      const qrSvg = await QRCode.toString(qrUrl, qrOptions)
  
      // Generate QR code as PNG using qrcode.toDataURL
      const qrPngDataUrl = await QRCode.toDataURL(qrUrl, {
        type: 'png',
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        margin: qrOptions.margin,
        width: qrOptions.width,
        color: qrOptions.color,
      })
  
      const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`
  
      return NextResponse.json({
        svgString: qrSvg,
        svgDataUrl,
        pngDataUrl: qrPngDataUrl, // Include pngDataUrl
      })
  
    } catch (error: any) {
      console.error('Error generating QR preview:', error)
      return NextResponse.json(
        { error: error.message || "Error generating QR preview" }, 
        { status: 500 }
      )
    }
  }