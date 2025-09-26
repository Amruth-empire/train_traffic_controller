"use client"

import { useEffect, useState } from "react"
import { useWebSocket } from "@/contexts/websocket-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap, X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function RealTimeNotifications() {
  const { newAlerts, optimizationSuggestions, clearAlerts, clearSuggestions } = useWebSocket()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (newAlerts.length > 0 || optimizationSuggestions.length > 0) {
      setIsVisible(true)
    }
  }, [newAlerts, optimizationSuggestions])

  if (!isVisible || (newAlerts.length === 0 && optimizationSuggestions.length === 0)) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-orange-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      {/* New Alerts */}
      {newAlerts.map((alert, index) => (
        <Card
          key={`${alert.id}-${index}`}
          className={cn(
            "bg-slate-800 border-slate-700 shadow-lg animate-in slide-in-from-right-full duration-300",
            "hover:border-slate-600 transition-colors",
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-white font-semibold text-sm">New Alert</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getSeverityColor(alert.severity)} text-white text-xs`}>{alert.severity}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    clearAlerts()
                    if (newAlerts.length === 1 && optimizationSuggestions.length === 0) {
                      setIsVisible(false)
                    }
                  }}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">{alert.title}</h3>
            <p className="text-slate-300 text-xs mb-2">{alert.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{alert.createdAt.toLocaleTimeString()}</span>
              <Bell className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* New Optimization Suggestions */}
      {optimizationSuggestions.map((suggestion, index) => (
        <Card
          key={`${suggestion.id}-${index}`}
          className={cn(
            "bg-slate-800 border-slate-700 shadow-lg animate-in slide-in-from-right-full duration-300",
            "hover:border-slate-600 transition-colors",
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-white font-semibold text-sm">AI Suggestion</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white text-xs">{(suggestion.confidence * 100).toFixed(0)}%</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    clearSuggestions()
                    if (optimizationSuggestions.length === 1 && newAlerts.length === 0) {
                      setIsVisible(false)
                    }
                  }}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <h3 className="text-white font-medium text-sm mb-1 capitalize">
              {suggestion.type.replace("_", " ")} - Train {suggestion.trainId}
            </h3>
            <p className="text-slate-300 text-xs mb-2">{suggestion.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{suggestion.createdAt.toLocaleTimeString()}</span>
              <span className="text-green-400">{suggestion.estimatedImprovement}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
