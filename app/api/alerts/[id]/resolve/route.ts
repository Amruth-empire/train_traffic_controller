import { type NextRequest, NextResponse } from "next/server"
import { mockAlerts } from "@/lib/mock-data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const alertId = params.id
    const { resolvedBy } = await request.json()

    const alertIndex = mockAlerts.findIndex((a) => a.id === alertId)
    if (alertIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert not found" }, { status: 404 })
    }

    // Mark alert as resolved
    mockAlerts[alertIndex].resolvedAt = new Date()

    return NextResponse.json({
      success: true,
      data: mockAlerts[alertIndex],
      message: "Alert resolved successfully",
    })
  } catch (error) {
    console.error("Error resolving alert:", error)
    return NextResponse.json({ success: false, error: "Failed to resolve alert" }, { status: 500 })
  }
}
