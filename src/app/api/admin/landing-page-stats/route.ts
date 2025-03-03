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
    const stats = await prisma.landingPageClickStat.findMany({
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

    // For dailyStats, instead of using $queryRaw, fetch all logs and process in memory
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30); // 30 days ago
    
    const logsForDailyStats = await prisma.landingPageActionLog.findMany({
      where: {
        ...(restaurantId ? { restaurantId } : {}),
        timestamp: {
          gte: startDate ? new Date(startDate) : defaultStartDate,
          lte: endDate ? new Date(endDate) : new Date()
        }
      },
      select: {
        timestamp: true,
        actionType: true,
        restaurantId: true
      }
    });

    // Process logs to create daily aggregations
    const dailyStatsMap = new Map();
    
    logsForDailyStats.forEach(log => {
      // Format the date to YYYY-MM-DD for grouping
      const dateStr = log.timestamp.toISOString().split('T')[0];
      const key = `${dateStr}_${log.actionType}_${log.restaurantId}`;
      
      if (dailyStatsMap.has(key)) {
        dailyStatsMap.set(key, {
          ...dailyStatsMap.get(key),
          count: dailyStatsMap.get(key).count + 1
        });
      } else {
        dailyStatsMap.set(key, {
          date: new Date(dateStr),
          actionType: log.actionType,
          restaurantId: log.restaurantId,
          count: 1
        });
      }
    });

    const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );

    return NextResponse.json({
      stats,
      logs,
      dailyStats
    });
  } catch (error) {
    console.error('Error fetching landing page stats:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      details: error instanceof Error ? { message: error.message } : error
    }, { status: 500 });
  }
}