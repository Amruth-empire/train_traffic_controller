import { type NextRequest, NextResponse } from "next/server"
import { mockTrains, mockStations } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainId = params.id
    const train = mockTrains.find((t) => t.id === trainId)

    if (!train) {
      return NextResponse.json({ success: false, error: "Train not found" }, { status: 404 })
    }

    // Get additional details
    const currentStation = mockStations.find((s) => s.name === train.currentLocation)
    const originStation = mockStations.find((s) => s.name === train.origin)
    const destinationStation = mockStations.find((s) => s.name === train.destination)

    const trainDetails = {
      ...train,
      currentStation,
      originStation,
      destinationStation,
      // Calculate progress percentage
      progress: Math.random() * 100, // Mock progress calculation
    }

    return NextResponse.json({
      success: true,
      data: trainDetails,
    })
  } catch (error) {
    console.error("Error fetching train details:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch train details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainId = params.id
    const updates = await request.json()

    const trainIndex = mockTrains.findIndex((t) => t.id === trainId)
    if (trainIndex === -1) {
      return NextResponse.json({ success: false, error: "Train not found" }, { status: 404 })
    }

    // Update train with provided data
    mockTrains[trainIndex] = { ...mockTrains[trainIndex], ...updates }

    return NextResponse.json({
      success: true,
      data: mockTrains[trainIndex],
      message: "Train updated successfully",
    })
  } catch (error) {
    console.error("Error updating train:", error)
    return NextResponse.json({ success: false, error: "Failed to update train" }, { status: 500 })
  }
}
