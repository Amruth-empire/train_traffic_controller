"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Compass as Compare } from "lucide-react"
import { simulationEngine } from "@/lib/simulation-engine"
import { mockTrains, mockStations } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { auditLogger } from "@/lib/audit-logger"
import type { SimulationScenario, SimulationResults } from "@/lib/types"

export function SimulationPanel() {
  const { user } = useAuth()
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([])
  const [currentScenario, setCurrentScenario] = useState<Partial<SimulationScenario>>({
    name: "",
    description: "",
    parameters: {
      trainDelays: [],
      stationClosures: [],
      weatherConditions: "normal",
      maintenanceWindows: [],
    },
  })
  const [selectedTrainId, setSelectedTrainId] = useState("")
  const [delayAmount, setDelayAmount] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const addTrainDelay = () => {
    if (!selectedTrainId || !delayAmount) return

    setCurrentScenario((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters!,
        trainDelays: [
          ...(prev.parameters?.trainDelays || []),
          { trainId: selectedTrainId, additionalDelay: Number.parseInt(delayAmount) },
        ],
      },
    }))

    setSelectedTrainId("")
    setDelayAmount("")
  }

  const addStationClosure = (stationId: string) => {
    setCurrentScenario((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters!,
        stationClosures: [...(prev.parameters?.stationClosures || []), stationId],
      },
    }))
  }

  const runSimulation = async () => {
    if (!currentScenario.name || !user) return

    setIsRunning(true)

    const scenario: SimulationScenario = {
      id: `sim_${Date.now()}`,
      name: currentScenario.name,
      description: currentScenario.description || "",
      parameters: currentScenario.parameters!,
      createdAt: new Date(),
      createdBy: user.id,
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = simulationEngine.runSimulation(scenario)
    scenario.results = results

    setScenarios((prev) => [scenario, ...prev])

    // Log the simulation run
    auditLogger.log(user, "Run Simulation", `Executed what-if scenario: ${scenario.name}`, "system")

    setIsRunning(false)
  }

  const compareScenarios = () => {
    if (scenarios.length < 2) return

    const comparison = simulationEngine.compareScenarios(scenarios.slice(0, 3))
    console.log("Scenario comparison:", comparison)
  }

  const ResultsCard = ({ results, title }: { results: SimulationResults; title: string }) => (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Delay:</span>
              <span className="text-red-400 font-semibold">{results.totalDelay} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Affected Trains:</span>
              <span className="text-yellow-400 font-semibold">{results.affectedTrains}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Passenger Impact:</span>
              <span className="text-orange-400 font-semibold">{results.passengerImpact} hrs</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Alt. Routes:</span>
              <span className="text-blue-400 font-semibold">{results.alternativeRoutes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Est. Cost:</span>
              <span className="text-green-400 font-semibold">${results.estimatedCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {results.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white font-semibold mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {results.recommendations.map((rec, idx) => (
                <li key={idx} className="text-slate-300 text-sm">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Play className="h-5 w-5 mr-2 text-green-500" />
          What-If Simulation Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="create" className="text-slate-300">
              Create Scenario
            </TabsTrigger>
            <TabsTrigger value="results" className="text-slate-300">
              Results
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-slate-300">
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Scenario Name</Label>
                <Input
                  value={currentScenario.name}
                  onChange={(e) => setCurrentScenario((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Train A delayed 10 minutes"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Weather Conditions</Label>
                <Select
                  value={currentScenario.parameters?.weatherConditions}
                  onValueChange={(value: any) =>
                    setCurrentScenario((prev) => ({
                      ...prev,
                      parameters: { ...prev.parameters!, weatherConditions: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="snow">Snow</SelectItem>
                    <SelectItem value="fog">Fog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Description</Label>
              <Input
                value={currentScenario.description}
                onChange={(e) => setCurrentScenario((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the scenario..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Train Delays */}
            <div className="space-y-2">
              <Label className="text-slate-300">Train Delays</Label>
              <div className="flex gap-2">
                <Select value={selectedTrainId} onValueChange={setSelectedTrainId}>
                  <SelectTrigger className="flex-1 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select train" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {mockTrains.map((train) => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.number} - {train.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={delayAmount}
                  onChange={(e) => setDelayAmount(e.target.value)}
                  placeholder="Minutes"
                  className="w-24 bg-slate-700 border-slate-600 text-white"
                />
                <Button onClick={addTrainDelay} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Add
                </Button>
              </div>

              {currentScenario.parameters?.trainDelays && currentScenario.parameters.trainDelays.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentScenario.parameters.trainDelays.map((delay, idx) => {
                    const train = mockTrains.find((t) => t.id === delay.trainId)
                    return (
                      <Badge key={idx} variant="secondary" className="bg-blue-600">
                        {train?.number}: +{delay.additionalDelay}min
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Station Closures */}
            <div className="space-y-2">
              <Label className="text-slate-300">Station Closures</Label>
              <div className="grid grid-cols-2 gap-2">
                {mockStations.map((station) => (
                  <Button
                    key={station.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addStationClosure(station.id)}
                    disabled={currentScenario.parameters?.stationClosures?.includes(station.id)}
                    className="justify-start border-slate-600 text-slate-300 hover:text-white bg-transparent"
                  >
                    {station.name}
                  </Button>
                ))}
              </div>

              {currentScenario.parameters?.stationClosures && currentScenario.parameters.stationClosures.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentScenario.parameters.stationClosures.map((stationId, idx) => {
                    const station = mockStations.find((s) => s.id === stationId)
                    return (
                      <Badge key={idx} variant="secondary" className="bg-red-600">
                        {station?.name} Closed
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={runSimulation}
                disabled={!currentScenario.name || isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? "Running..." : "Run Simulation"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {scenarios.length === 0 ? (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No simulation results yet</p>
                <p className="text-slate-500 text-sm">Create and run a scenario to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id}>
                    <h3 className="text-white font-semibold mb-2">{scenario.name}</h3>
                    {scenario.results && <ResultsCard results={scenario.results} title={scenario.description} />}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="compare" className="space-y-4">
            {scenarios.length < 2 ? (
              <div className="text-center py-8">
                <Compare className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">Need at least 2 scenarios to compare</p>
                <p className="text-slate-500 text-sm">Run more simulations to enable comparison</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Button onClick={compareScenarios} className="bg-purple-600 hover:bg-purple-700">
                  <Compare className="h-4 w-4 mr-2" />
                  Compare Scenarios
                </Button>

                <div className="grid gap-4">
                  {scenarios.slice(0, 3).map((scenario, idx) => (
                    <div key={scenario.id} className="relative">
                      {idx === 0 && <Badge className="absolute -top-2 -right-2 bg-green-600">Best</Badge>}
                      {scenario.results && <ResultsCard results={scenario.results} title={scenario.name} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
