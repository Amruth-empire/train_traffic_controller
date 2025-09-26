import { type NextRequest, NextResponse } from "next/server"
import { mockAlerts } from "@/lib/mock-data"
import type { Alert } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")
    const active = searchParams.get("active")

    let filteredAlerts = [...mockAlerts]

    // Filter by severity
    if (severity) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.severity === severity)
    }

    // Filter by type
    if (type) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.type === type)
    }

    // Filter by active status
    if (active === "true") {
      filteredAlerts = filteredAlerts.filter((alert) => !alert.resolvedAt)
    }

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    const newAlert: Alert = {
      id: `al${Date.now()}`,
      type: alertData.type,
      severity: alertData.severity,
      title: alertData.title,
      description: alertData.description,
      affectedTrains: alertData.affectedTrains || [],
      affectedStations: alertData.affectedStations || [],
      createdAt: new Date(),
      createdBy: alertData.createdBy,
    }

    mockAlerts.push(newAlert)

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: "Alert created successfully",
    })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 500 })
  }
}
