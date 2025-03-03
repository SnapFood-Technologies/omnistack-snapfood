// app/api/external/landing-page/track/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/middleware/api-auth';

export async function POST(request: Request) {
  // Check API key first
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { hashId, actionType, ipAddress, userAgent, referrer } = body;
    
    if (!hashId || !actionType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Find the restaurant by hashId
    const restaurant = await prisma.restaurant.findFirst({
      where: { hashId },
      select: { id: true }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Log the action
    await prisma.landingPageActionLog.create({
      data: {
        restaurantId: restaurant.id,
        actionType,
        ipAddress,
        userAgent,
        referrer
      }
    });

    // Update aggregate stats
    await prisma.landingPageStat.upsert({
      where: {
        restaurantId_actionType: {
          restaurantId: restaurant.id,
          actionType
        }
      },
      create: {
        restaurantId: restaurant.id,
        actionType,
        count: 1
      },
      update: {
        count: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking landing page action:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to track action',
      details: error
    }, { status: 500 });
  }
}