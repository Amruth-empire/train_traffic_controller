import { type NextRequest, NextResponse } from "next/server"
import type { AlertRule } from "@/lib/types"

// Mock storage (same as in route.ts - in production this would be shared via database)
const alertRules: AlertRule[] = []

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    const ruleIndex = alertRules.findIndex((rule) => rule.id === id)
    if (ruleIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert rule not found" }, { status: 404 })
    }

    alertRules[ruleIndex] = { ...alertRules[ruleIndex], ...updates }

    return NextResponse.json({
      success: true,
      data: alertRules[ruleIndex],
    })
  } catch (error) {
    console.error("Error updating alert rule:", error)
    return NextResponse.json({ success: false, error: "Failed to update alert rule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const ruleIndex = alertRules.findIndex((rule) => rule.id === id)
    if (ruleIndex === -1) {
      return NextResponse.json({ success: false, error: "Alert rule not found" }, { status: 404 })
    }

    const deletedRule = alertRules.splice(ruleIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedRule,
    })
  } catch (error) {
    console.error("Error deleting alert rule:", error)
    return NextResponse.json({ success: false, error: "Failed to delete alert rule" }, { status: 500 })
  }
}
