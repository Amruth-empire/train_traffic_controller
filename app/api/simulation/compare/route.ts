import { type NextRequest, NextResponse } from "next/server"
import { simulationEngine } from "@/lib/simulation-engine"
import type { SimulationScenario } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { scenarios }: { scenarios: SimulationScenario[] } = await request.json()

    if (scenarios.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 scenarios required for comparison" },
        { status: 400 },
      )
    }

    const comparison = simulationEngine.compareScenarios(scenarios)

    return NextResponse.json({
      success: true,
      data: comparison,
    })
  } catch (error) {
    console.error("Error comparing scenarios:", error)
    return NextResponse.json({ success: false, error: "Failed to compare scenarios" }, { status: 500 })
  }
}
