import { type NextRequest, NextResponse } from "next/server"
import { mockOptimizationSuggestions, mockTrains } from "@/lib/mock-data"
import type { OptimizationSuggestion } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const trainId = searchParams.get("trainId")

    let filteredSuggestions = [...mockOptimizationSuggestions]

    // Filter by status
    if (status) {
      filteredSuggestions = filteredSuggestions.filter((suggestion) => suggestion.status === status)
    }

    // Filter by train ID
    if (trainId) {
      filteredSuggestions = filteredSuggestions.filter((suggestion) => suggestion.trainId === trainId)
    }

    return NextResponse.json({
      success: true,
      data: filteredSuggestions,
      total: filteredSuggestions.length,
    })
  } catch (error) {
    console.error("Error fetching optimization suggestions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch suggestions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, suggestionId, trainId } = await request.json()

    switch (action) {
      case "accept":
        const acceptIndex = mockOptimizationSuggestions.findIndex((s) => s.id === suggestionId)
        if (acceptIndex !== -1) {
          mockOptimizationSuggestions[acceptIndex].status = "accepted"
          // Simulate implementing the suggestion
          setTimeout(() => {
            mockOptimizationSuggestions[acceptIndex].status = "implemented"
          }, 2000)
        }
        break

      case "reject":
        const rejectIndex = mockOptimizationSuggestions.findIndex((s) => s.id === suggestionId)
        if (rejectIndex !== -1) {
          mockOptimizationSuggestions[rejectIndex].status = "rejected"
        }
        break

      case "generate":
        // Generate new optimization suggestions for a train
        const train = mockTrains.find((t) => t.id === trainId)
        if (train && train.delay > 0) {
          const newSuggestion: OptimizationSuggestion = {
            id: `opt${Date.now()}`,
            type: "reroute",
            trainId: train.id,
            description: `Optimize route for ${train.number} to reduce ${train.delay}-minute delay`,
            estimatedImprovement: `Reduce delay by ${Math.floor(train.delay * 0.6)} minutes`,
            confidence: 0.75 + Math.random() * 0.2,
            createdAt: new Date(),
            status: "pending",
          }
          mockOptimizationSuggestions.push(newSuggestion)
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Optimization ${action} completed successfully`,
    })
  } catch (error) {
    console.error("Error processing optimization:", error)
    return NextResponse.json({ success: false, error: "Failed to process optimization" }, { status: 500 })
  }
}
