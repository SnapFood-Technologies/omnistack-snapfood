// src/app/api/restaurants/[restaurantId]/qr-codes/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

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
    return NextResponse.json(
      { error: "Error fetching QR codes" }, 
      { status: 500 }
    )
  }
}


export async function POST(
  req: Request,
  { params }: { params: { restaurantId?: string } }
) {
  try {
    if (!params?.restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      )
    }

    const data = await req.formData()
    
    // Generate URL based on menu or custom URL
    const qrUrl = data.get('customUrl') 
      ? String(data.get('customUrl'))
      : `${process.env.NEXT_PUBLIC_APP_URL}/menu/${data.get('menuId')}`

    // QR code generation options
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      type: 'svg',
      color: {
        dark: String(data.get('primaryColor')),
        light: String(data.get('backgroundColor')),
      },
      errorCorrectionLevel: data.get('errorLevel') as 'L' | 'M' | 'Q' | 'H',
      margin: 1,
      width: data.get('size') === 'large' ? 400 : data.get('size') === 'medium' ? 300 : 200,
    }

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(qrUrl, qrOptions)

    // Save to database
    const qrCode = await prisma.qRCode.create({
      data: {
        code: qrDataUrl,
        design: String(data.get('design')),
        primaryColor: String(data.get('primaryColor')),
        backgroundColor: String(data.get('backgroundColor')),
        size: String(data.get('size')),
        customText: data.get('customText') ? String(data.get('customText')) : null,
        hasLogo: Boolean(data.get('hasLogo')),
        errorLevel: String(data.get('errorLevel')),
        type: String(data.get('type')) as 'TABLE' | 'TAKEOUT' | 'SPECIAL',
        tableNumber: data.get('tableNumber') ? parseInt(String(data.get('tableNumber'))) : null,
        menuId: data.get('menuId') ? String(data.get('menuId')) : undefined,
        restaurantId: params.restaurantId,
      },
    })

    return NextResponse.json(qrCode)
  } catch (error) {
    console.error('Error creating QR code:', error)
    return NextResponse.json(
      { error: "Error creating QR code" }, 
      { status: 500 }
    )
  }
}