import { NextResponse } from "next/server";
import { irctcService, POPULAR_TRAIN_NUMBERS } from "@/lib/irctc-service";
import type { Train } from "@/lib/types";

// Convert IRCTC API data to our Train interface
function convertIRCTCToTrain(irctcData: any, index: number): Train {
  const now = new Date();
  const delay = irctcData.late_minutes || 0;
  
  return {
    id: `tr_${irctcData.train_number}`,
    number: irctcData.train_number,
    name: irctcData.train_name || `Train ${irctcData.train_number}`,
    type: irctcData.train_number.startsWith('1') ? 'express' : 'passenger',
    status: delay > 10 ? 'delayed' : delay > 0 ? 'running' : 'on_time',
    currentLocation: irctcData.current_station_name || "Unknown Station",
    destination: irctcData.to_station_name || "Unknown Destination",
    origin: irctcData.from_station_name || "Unknown Origin",
    scheduledDeparture: new Date(now.getTime() - (2 * 60 * 60 * 1000)), // 2 hours ago
    actualDeparture: new Date(now.getTime() - (2 * 60 * 60 * 1000) + (delay * 60 * 1000)),
    scheduledArrival: new Date(now.getTime() + (1 * 60 * 60 * 1000)), // 1 hour from now
    estimatedArrival: new Date(now.getTime() + (1 * 60 * 60 * 1000) + (delay * 60 * 1000)),
    delay: delay,
    priority: delay > 15 ? 9 : delay > 5 ? 7 : 5,
    capacity: 400,
    occupancy: Math.floor(Math.random() * 350) + 50, // Random occupancy
    speed: delay > 10 ? 45 : 75 + Math.floor(Math.random() * 40), // Slower if delayed
    maxSpeed: 120,
    coordinates: {
      lat: 20.5937 + (Math.random() - 0.5) * 10, // Random coordinates around India
      lng: 78.9629 + (Math.random() - 0.5) * 20
    },
    occupiedTrack: `track-${index + 1}`,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const useCache = searchParams.get('cache') !== 'false';
    
    console.log(`🚂 Fetching real train data (limit: ${limit}, cache: ${useCache})`);
    
    // Get a subset of popular train numbers to stay within API limits
    const trainNumbers = POPULAR_TRAIN_NUMBERS.slice(0, Math.min(limit, 3));
    
    // Fetch real data from IRCTC API
    const trainStatusMap = await irctcService.getMultipleTrainStatus(trainNumbers);
    
    // Convert to our Train interface
    const realTrains: Train[] = [];
    let index = 0;
    
    for (const [trainNumber, status] of trainStatusMap) {
      const train = convertIRCTCToTrain(status, index);
      realTrains.push(train);
      index++;
    }
    
    // If we need more trains and haven't reached API limit, add some fallback trains
    while (realTrains.length < limit) {
      const fallbackTrainNumber = `1${2000 + realTrains.length}${Math.floor(Math.random() * 10)}`;
      const fallbackStatus = {
        train_number: fallbackTrainNumber,
        train_name: `Express ${fallbackTrainNumber}`,
        from_station_name: "Delhi Junction",
        to_station_name: "Mumbai Central",
        current_station_name: "Bharuch Junction",
        train_start_date: new Date().toISOString().split('T')[0],
        late_minutes: Math.floor(Math.random() * 20),
        a_day_late: false,
        a_day_rescheduled: false
      };
      
      const train = convertIRCTCToTrain(fallbackStatus, realTrains.length);
      realTrains.push(train);
    }
    
    // Get cache statistics
    const cacheStats = irctcService.getCacheStats();
    
    return NextResponse.json({
      success: true,
      data: realTrains,
      meta: {
        total: realTrains.length,
        realDataCount: trainStatusMap.size,
        fallbackDataCount: realTrains.length - trainStatusMap.size,
        cacheStats,
        apiUsage: {
          requestsUsed: cacheStats.requestsUsed,
          requestsRemaining: cacheStats.requestsRemaining,
          monthlyLimit: 20
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in trains API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch train data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper endpoint to get cache statistics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'clearCache') {
      irctcService.cleanCache();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully',
        cacheStats: irctcService.getCacheStats()
      });
    }
    
    if (body.action === 'getStats') {
      return NextResponse.json({
        success: true,
        cacheStats: irctcService.getCacheStats()
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request'
    }, { status: 400 });
  }
}