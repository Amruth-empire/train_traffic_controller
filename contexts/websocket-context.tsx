"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getWebSocketInstance } from "@/lib/websocket"
import type { Alert, KPI, OptimizationSuggestion } from "@/lib/types"

interface WebSocketContextType {
  isConnected: boolean
  trainUpdates: any[]
  newAlerts: Alert[]
  kpiUpdates: Partial<KPI> | null
  optimizationSuggestions: OptimizationSuggestion[]
  clearAlerts: () => void
  clearSuggestions: () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [trainUpdates, setTrainUpdates] = useState<any[]>([])
  const [newAlerts, setNewAlerts] = useState<Alert[]>([])
  const [kpiUpdates, setKpiUpdates] = useState<Partial<KPI> | null>(null)
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([])

  useEffect(() => {
    const ws = getWebSocketInstance()
    setIsConnected(true)

    // Subscribe to train updates
    const unsubscribeTrainUpdates = ws.on("train_update", (data) => {
      console.log("[v0] Received train updates:", data)
      setTrainUpdates((prev) => [...prev.slice(-10), data]) // Keep last 10 updates
    })

    // Subscribe to new alerts
    const unsubscribeAlerts = ws.on("alert", (data) => {
      console.log("[v0] Received new alert:", data)
      setNewAlerts((prev) => [data.alert, ...prev.slice(0, 4)]) // Keep last 5 alerts
    })

    // Subscribe to KPI updates
    const unsubscribeKPIs = ws.on("kpi_update", (data) => {
      console.log("[v0] Received KPI updates:", data)
      setKpiUpdates(data.kpis)
    })

    // Subscribe to optimization suggestions
    const unsubscribeOptimization = ws.on("optimization_suggestion", (data) => {
      console.log("[v0] Received optimization suggestion:", data)
      setOptimizationSuggestions((prev) => [data.suggestion, ...prev.slice(0, 2)]) // Keep last 3 suggestions
    })

    // Cleanup on unmount
    return () => {
      unsubscribeTrainUpdates()
      unsubscribeAlerts()
      unsubscribeKPIs()
      unsubscribeOptimization()
    }
  }, [])

  const clearAlerts = () => setNewAlerts([])
  const clearSuggestions = () => setOptimizationSuggestions([])

  const value: WebSocketContextType = {
    isConnected,
    trainUpdates,
    newAlerts,
    kpiUpdates,
    optimizationSuggestions,
    clearAlerts,
    clearSuggestions,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
