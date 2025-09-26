import { type NextRequest, NextResponse } from "next/server"
import { auditLogger } from "@/lib/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const entityType = searchParams.get("entityType") as any
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const filters: any = {}
    if (userId) filters.userId = userId
    if (entityType) filters.entityType = entityType
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)

    const logs = auditLogger.getLogs(filters)

    return NextResponse.json({
      success: true,
      data: logs,
      total: logs.length,
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
