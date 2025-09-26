import type { SimulationScenario, SimulationResults } from "./types"
import { mockTrains, mockStations } from "./mock-data"

class SimulationEngine {
  runSimulation(scenario: SimulationScenario): SimulationResults {
    console.log("[v0] Running simulation:", scenario.name)

    let totalDelay = 0
    let affectedTrains = 0
    let passengerImpact = 0
    let alternativeRoutes = 0
    const recommendations: string[] = []

    // Simulate train delays
    if (scenario.parameters.trainDelays) {
      scenario.parameters.trainDelays.forEach((delay) => {
        const train = mockTrains.find((t) => t.id === delay.trainId)
        if (train) {
          totalDelay += delay.additionalDelay
          affectedTrains++
          if (train.type === "passenger") {
            passengerImpact += train.occupancy * (delay.additionalDelay / 60) // passenger-hours
          }
        }
      })
    }

    // Simulate station closures
    if (scenario.parameters.stationClosures) {
      scenario.parameters.stationClosures.forEach((stationId) => {
        const station = mockStations.find((s) => s.id === stationId)
        if (station) {
          const affectedTrainsCount = mockTrains.filter(
            (t) => t.currentLocation === station.name || t.destination === station.name,
          ).length

          affectedTrains += affectedTrainsCount
          totalDelay += affectedTrainsCount * 20 // Average 20 min delay per affected train
          alternativeRoutes += Math.ceil(affectedTrainsCount / 2)

          recommendations.push(`Reroute trains via alternative stations due to ${station.name} closure`)
        }
      })
    }

    // Simulate weather conditions
    if (scenario.parameters.weatherConditions && scenario.parameters.weatherConditions !== "normal") {
      const weatherMultiplier =
        {
          rain: 1.2,
          snow: 1.5,
          fog: 1.3,
        }[scenario.parameters.weatherConditions] || 1

      totalDelay *= weatherMultiplier
      recommendations.push(
        `Implement weather-specific speed restrictions for ${scenario.parameters.weatherConditions} conditions`,
      )
    }

    // Simulate maintenance windows
    if (scenario.parameters.maintenanceWindows) {
      scenario.parameters.maintenanceWindows.forEach((maintenance) => {
        const station = mockStations.find((s) => s.id === maintenance.stationId)
        if (station) {
          const maintenanceImpact = maintenance.duration * 0.3 // 30% of maintenance time affects operations
          totalDelay += maintenanceImpact
          recommendations.push(`Schedule maintenance during low-traffic periods at ${station.name}`)
        }
      })
    }

    const estimatedCost = totalDelay * 150 + passengerImpact * 25 // $150 per delay minute + $25 per passenger-hour

    return {
      totalDelay: Math.round(totalDelay),
      affectedTrains,
      passengerImpact: Math.round(passengerImpact),
      alternativeRoutes,
      estimatedCost: Math.round(estimatedCost),
      recommendations,
    }
  }

  compareScenarios(scenarios: SimulationScenario[]): {
    best: SimulationScenario
    worst: SimulationScenario
    comparison: Array<{
      scenario: SimulationScenario
      score: number
    }>
  } {
    const scoredScenarios = scenarios
      .map((scenario) => {
        if (!scenario.results) {
          scenario.results = this.runSimulation(scenario)
        }

        // Lower is better (less delay, cost, impact)
        const score =
          scenario.results.totalDelay + scenario.results.estimatedCost / 100 + scenario.results.passengerImpact * 2

        return { scenario, score }
      })
      .sort((a, b) => a.score - b.score)

    return {
      best: scoredScenarios[0].scenario,
      worst: scoredScenarios[scoredScenarios.length - 1].scenario,
      comparison: scoredScenarios,
    }
  }
}

export const simulationEngine = new SimulationEngine()
