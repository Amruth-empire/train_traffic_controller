import { type NextRequest, NextResponse } from "next/server"
import { simulationEngine } from "@/lib/simulation-engine"
import type { SimulationScenario } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const scenario: SimulationScenario = await request.json()

    // Run the simulation
    const results = simulationEngine.runSimulation(scenario)

    return NextResponse.json({
      success: true,
      data: {
        ...scenario,
        results,
      },
    })
  } catch (error) {
    console.error("Error running simulation:", error)
    return NextResponse.json({ success: false, error: "Failed to run simulation" }, { status: 500 })
  }
}
