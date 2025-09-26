import { type NextRequest, NextResponse } from "next/server"
import { getOptimizationEngine } from "@/lib/optimization-engine"
import { mockOptimizationSuggestions, mockTrains, mockStations, mockAlerts } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const { suggestionId, userId } = await request.json()

    const suggestion = mockOptimizationSuggestions.find((s) => s.id === suggestionId)
    if (!suggestion) {
      return NextResponse.json({ success: false, error: "Suggestion not found" }, { status: 404 })
    }

    if (suggestion.status !== "pending") {
      return NextResponse.json({ success: false, error: "Suggestion is not in pending status" }, { status: 400 })
    }

    const optimizationEngine = getOptimizationEngine()

    // Prepare context for simulation
    const context = {
      trains: mockTrains,
      stations: mockStations,
      alerts: mockAlerts.filter((alert) => !alert.resolvedAt),
      currentTime: new Date(),
    }

    // Simulate implementation
    const implementationResult = optimizationEngine.simulateImplementation(suggestion, context)

    if (implementationResult.success) {
      // Update suggestion status
      suggestion.status = "accepted"

      // Apply the optimization to the train data
      const train = mockTrains.find((t) => t.id === suggestion.trainId)
      if (train) {
        switch (suggestion.type) {
          case "reroute":
            train.delay = Math.max(0, train.delay - Math.floor(train.delay * 0.6))
            break
          case "priority_change":
            train.priority = Math.min(10, train.priority + 2)
            train.delay = Math.max(0, train.delay - Math.floor(train.delay * 0.4))
            break
          case "reschedule":
            train.status = "scheduled"
            train.delay = 0
            break
          case "platform_change":
            // Platform change doesn't directly affect delay but improves efficiency
            break
        }
      }

      // Simulate implementation delay
      setTimeout(() => {
        suggestion.status = "implemented"
      }, 3000)

      return NextResponse.json({
        success: true,
        data: {
          suggestion,
          implementation: implementationResult,
          updatedTrain: train,
        },
        message: "Optimization implemented successfully",
      })
    } else {
      // Mark as rejected if implementation failed
      suggestion.status = "rejected"

      return NextResponse.json({
        success: false,
        error: implementationResult.actualImprovement,
        data: {
          suggestion,
          implementation: implementationResult,
        },
      })
    }
  } catch (error) {
    console.error("Error implementing optimization:", error)
    return NextResponse.json({ success: false, error: "Failed to implement optimization" }, { status: 500 })
  }
}
