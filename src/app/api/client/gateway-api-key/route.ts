// app/api/client/gateway-api-key/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // Get clientId from the URL
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            select: { omniGatewayApiKey: true }
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({ apiKey: client.omniGatewayApiKey });
    } catch (error) {
        console.error('Error fetching gateway API key:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
