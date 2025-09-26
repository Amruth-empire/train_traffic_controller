import { type NextRequest, NextResponse } from "next/server"
import { mockStations } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    let filteredStations = [...mockStations]

    // Filter by section
    if (section) {
      filteredStations = filteredStations.filter((station) => station.section === section)
    }

    return NextResponse.json({
      success: true,
      data: filteredStations,
      total: filteredStations.length,
    })
  } catch (error) {
    console.error("Error fetching stations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stations" }, { status: 500 })
  }
}
