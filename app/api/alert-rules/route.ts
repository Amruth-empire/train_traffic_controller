import { type NextRequest, NextResponse } from "next/server"
import type { AlertRule } from "@/lib/types"

// Mock storage for alert rules (in production, this would be in a database)
const alertRules: AlertRule[] = [
  {
    id: "rule1",
    name: "High Delay Alert",
    description: "Alert when any train is delayed more than 15 minutes",
    condition: {
      metric: "delay",
      operator: ">",
      threshold: 15,
      duration: 5,
    },
    actions: {
      notify: true,
      escalate: false,
      autoResolve: false,
    },
    isActive: true,
    createdBy: "1",
    createdAt: new Date("2024-01-15"),
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: alertRules,
    })
  } catch (error) {
    console.error("Error fetching alert rules:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch alert rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newRule: Omit<AlertRule, "id" | "createdAt"> = await request.json()

    const rule: AlertRule = {
      ...newRule,
      id: `rule_${Date.now()}`,
      createdAt: new Date(),
    }

    alertRules.push(rule)

    return NextResponse.json({
      success: true,
      data: rule,
    })
  } catch (error) {
    console.error("Error creating alert rule:", error)
    return NextResponse.json({ success: false, error: "Failed to create alert rule" }, { status: 500 })
  }
}
