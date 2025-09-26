import { type NextRequest, NextResponse } from "next/server"
import { getOptimizationEngine } from "@/lib/optimization-engine"
import { mockTrains, mockStations, mockAlerts } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const { trainId, forceAnalysis = false } = await request.json()

    const optimizationEngine = getOptimizationEngine()

    // Prepare optimization context
    const context = {
      trains: mockTrains,
      stations: mockStations,
      alerts: mockAlerts.filter((alert) => !alert.resolvedAt),
      currentTime: new Date(),
    }

    let result
    if (trainId) {
      // Analyze specific train
      const train = mockTrains.find((t) => t.id === trainId)
      if (!train) {
        return NextResponse.json({ success: false, error: "Train not found" }, { status: 404 })
      }

      // Filter context to focus on specific train
      const trainContext = {
        ...context,
        trains: [train],
      }

      result = optimizationEngine.optimize(trainContext)
    } else {
      // Analyze entire system
      result = optimizationEngine.optimize(context)
    }

    return NextResponse.json({
      success: true,
      data: result,
      analysisTime: new Date().toISOString(),
      context: {
        totalTrains: context.trains.length,
        activeAlerts: context.alerts.length,
        delayedTrains: context.trains.filter((t) => t.delay > 0).length,
      },
    })
  } catch (error) {
    console.error("Error analyzing optimization:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze optimization" }, { status: 500 })
  }
}
