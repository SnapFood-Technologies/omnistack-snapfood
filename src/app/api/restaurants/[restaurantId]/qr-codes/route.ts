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
    console.log('Error fetching QR codes:', error.message)
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
    const qrSvg = await QRCode.toString(qrUrl, qrOptions)

  
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
        errorCorrectionLevel: String(formData.get('errorLevel')),
        type: String(formData.get('type')) as 'TABLE' | 'TAKEOUT' | 'SPECIAL',
        tableNumber: formData.get('tableNumber') ? Number(formData.get('tableNumber')) : null,
        menuId: menuId, // Set to null if customUrl is used
        //restaurantId: '349'
      },
    })

    

    return NextResponse.json({
      success: true,
      qrCode,
      svgString: qrSvg
    })

  } catch (error) {
    console.log('error.message', error.message);
    return NextResponse.json(
      { error: error.message }, // Return error message
      { status: 500 }
    )
  }
}