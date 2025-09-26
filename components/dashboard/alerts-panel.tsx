"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle, X } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
        return "bg-yellow-600 text-black"
      case "low":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "delay":
        return <Clock className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "cancellation":
        return <X className="h-4 w-4" />
      case "maintenance":
        return <CheckCircle className="h-4 w-4" />
      case "weather":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.resolvedAt)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Active Alerts ({activeAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-400">No active alerts</p>
              <p className="text-slate-500 text-sm">All systems operating normally</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(alert.type)}
                    <h3 className="text-white font-semibold">{alert.title}</h3>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                </div>

                <p className="text-slate-300 text-sm mb-3">{alert.description}</p>

                <div className="space-y-2 text-xs">
                  {alert.affectedTrains.length > 0 && (
                    <div>
                      <span className="text-slate-400">Affected Trains: </span>
                      <span className="text-white">{alert.affectedTrains.join(", ")}</span>
                    </div>
                  )}
                  {alert.affectedStations.length > 0 && (
                    <div>
                      <span className="text-slate-400">Affected Stations: </span>
                      <span className="text-white">{alert.affectedStations.join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Created: </span>
                    <span className="text-white">
                      {alert.createdAt.toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end mt-3 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-400 hover:text-white hover:bg-green-600 bg-transparent"
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
