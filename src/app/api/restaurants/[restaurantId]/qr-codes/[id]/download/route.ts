// src/app/api/restaurants/[restaurantId]/qr-codes/[id]/download/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import QRCode from "qrcode"

export async function GET(
  req: Request,
  { params }: { params: { restaurantId: string; id: string } }
) {
  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id: params.id,
        restaurantId: params.restaurantId,
      },
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

    // Return the QR code data
    return new NextResponse(qrCode.code, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="qr-code-${qrCode.id}.svg"`
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error downloading QR code" },
      { status: 500 }
    )
  }
}