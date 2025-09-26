import { NextResponse } from "next/server"
import { mockKPIs, mockTrains, mockStations } from "@/lib/mock-data"
import { calculateAverageDelay, getDelayedTrains } from "@/lib/mock-data"

export async function GET() {
  try {
    // Calculate real-time KPIs based on current data
    const delayedTrains = getDelayedTrains()
    const activeTrains = mockTrains.filter((t) => t.status === "running" || t.status === "delayed")
    const cancelledTrains = mockTrains.filter((t) => t.status === "cancelled")

    // Calculate station capacity utilization
    const totalCapacity = mockStations.reduce((sum, station) => sum + station.capacity, 0)
    const totalOccupancy = mockStations.reduce((sum, station) => sum + station.currentOccupancy, 0)
    const capacityUtilization = (totalOccupancy / totalCapacity) * 100

    // Calculate on-time performance
    const totalScheduledTrains = mockTrains.length
    const onTimeTrains = mockTrains.filter((t) => t.delay === 0).length
    const onTimePerformance = (onTimeTrains / totalScheduledTrains) * 100

    const updatedKPIs = {
      ...mockKPIs,
      onTimePerformance,
      averageDelay: calculateAverageDelay(),
      activeTrains: activeTrains.length,
      delayedTrains: delayedTrains.length,
      cancelledTrains: cancelledTrains.length,
      stationCapacityUtilization: capacityUtilization,
      totalTrainsToday: mockTrains.length,
      systemEfficiency: Math.max(85, 100 - delayedTrains.length * 2 - cancelledTrains.length * 5),
    }

    return NextResponse.json({
      success: true,
      data: updatedKPIs,
    })
  } catch (error) {
    console.error("Error calculating KPIs:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate KPIs" }, { status: 500 })
  }
}
