// app/api/admin/landing-page-stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build query
    const query: any = {};
    
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.lte = new Date(endDate);
      }
    }

    // Get aggregated stats
    const stats = await prisma.landingPageStat.findMany({
      where: restaurantId ? { restaurantId } : {},
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            hashId: true
          }
        }
      }
    });

    // Get detailed logs with date filter if provided
    const logs = await prisma.landingPageActionLog.findMany({
      where: query,
      orderBy: {
        timestamp: 'desc'
      },
      take: 1000, // Limit to prevent too much data
      include: {
        restaurant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Compute daily stats for charts
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', timestamp) as date,
        "actionType",
        "restaurantId",
        COUNT(*) as count
      FROM "LandingPageActionLog"
      WHERE ${restaurantId ? `"restaurantId" = ${restaurantId} AND` : ''}
            timestamp >= ${startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
            AND timestamp <= ${endDate ? new Date(endDate) : new Date()}
      GROUP BY DATE_TRUNC('day', timestamp), "actionType", "restaurantId"
      ORDER BY date ASC
    `;

    return NextResponse.json({
      stats,
      logs,
      dailyStats
    });
  } catch (error) {
    console.error('Error fetching landing page stats:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      details: error
    }, { status: 500 });
  }
}