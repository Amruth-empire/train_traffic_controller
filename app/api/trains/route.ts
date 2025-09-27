import { type NextRequest, NextResponse } from "next/server"
import { mockTrains, mockStations } from "@/lib/mock-data"
import { irctcService, POPULAR_TRAIN_NUMBERS } from "@/lib/irctc-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const section = searchParams.get("section")
    const type = searchParams.get("type")
    const useReal = searchParams.get("real") === "true"

    let filteredTrains = [...mockTrains]
    
    // If real data is requested, try to get some real train data
    if (useReal) {
      try {
        const realTrainNumbers = POPULAR_TRAIN_NUMBERS.slice(0, 2) // Limit to 2 to conserve API calls
        const realTrainData = await irctcService.getMultipleTrainStatus(realTrainNumbers)
        
        // Update mock trains with real data where available
        let realDataCount = 0
        for (const [trainNumber, irctcData] of realTrainData) {
          if (realDataCount < filteredTrains.length) {
            const train = filteredTrains[realDataCount]
            train.number = irctcData.train_number
            train.name = irctcData.train_name || train.name
            train.currentLocation = irctcData.current_station_name || train.currentLocation
            train.destination = irctcData.to_station_name || train.destination
            train.origin = irctcData.from_station_name || train.origin
            train.delay = irctcData.late_minutes || 0
            train.status = train.delay > 10 ? 'delayed' : train.delay > 0 ? 'running' : 'on_time'
            realDataCount++
          }
        }
        
        console.log(`🚂 Enhanced ${realDataCount} trains with real IRCTC data`)
      } catch (error) {
        console.warn('⚠️ Failed to fetch real train data, using mock data:', error)
      }
    }

    // Filter by status
    if (status) {
      filteredTrains = filteredTrains.filter((train) => train.status === status)
    }

    // Filter by type
    if (type) {
      filteredTrains = filteredTrains.filter((train) => train.type === type)
    }

    // Filter by section
    if (section) {
      filteredTrains = filteredTrains.filter((train) => {
        const station = mockStations.find((s) => s.name === train.currentLocation)
        return station?.section === section
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredTrains,
      total: filteredTrains.length,
    })
  } catch (error) {
    console.error("Error fetching trains:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trains" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trainId, action, data } = body

    // Simulate train operations
    switch (action) {
      case "update_status":
        // Update train status
        const train = mockTrains.find((t) => t.id === trainId)
        if (train) {
          train.status = data.status
          if (data.delay !== undefined) {
            train.delay = data.delay
          }
        }
        break

      case "update_priority":
        // Update train priority
        const priorityTrain = mockTrains.find((t) => t.id === trainId)
        if (priorityTrain) {
          priorityTrain.priority = data.priority
        }
        break

      case "emergency_stop":
        // Emergency stop
        const emergencyTrain = mockTrains.find((t) => t.id === trainId)
        if (emergencyTrain) {
          emergencyTrain.status = "cancelled"
          emergencyTrain.speed = 0
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Train ${trainId} ${action} completed successfully`,
    })
  } catch (error) {
    console.error("Error updating train:", error)
    return NextResponse.json({ success: false, error: "Failed to update train" }, { status: 500 })
  }
}
