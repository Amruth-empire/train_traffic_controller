"use client"

import type { WebSocketMessage } from "./types"

export class TrainControlWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(private url = "ws://localhost:3001") {
    this.connect()
  }

  private connect() {
    try {
      // In a real implementation, this would connect to an actual WebSocket server
      // For demo purposes, we'll simulate WebSocket behavior with intervals
      this.simulateWebSocket()
    } catch (error) {
      console.error("WebSocket connection failed:", error)
      this.handleReconnect()
    }
  }

  private simulateWebSocket() {
    // Simulate WebSocket connection with periodic updates
    console.log(" Simulating WebSocket connection for real-time updates")

    // Simulate train position updates every 3 seconds
    setInterval(() => {
      this.emit("train_update", {
        type: "position_update",
        trains: this.generateTrainUpdates(),
        timestamp: new Date(),
      })
    }, 3000)

    // Simulate KPI updates every 10 seconds
    setInterval(() => {
      this.emit("kpi_update", {
        type: "kpi_update",
        kpis: this.generateKPIUpdates(),
        timestamp: new Date(),
      })
    }, 10000)

    // Simulate random alerts every 30 seconds (20% chance)
    setInterval(() => {
      if (Math.random() < 0.2) {
        this.emit("alert", {
          type: "new_alert",
          alert: this.generateRandomAlert(),
          timestamp: new Date(),
        })
      }
    }, 30000)

    // Simulate optimization suggestions every 45 seconds (30% chance)
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.emit("optimization_suggestion", {
          type: "new_suggestion",
          suggestion: this.generateOptimizationSuggestion(),
          timestamp: new Date(),
        })
      }
    }, 45000)
  }

  private generateTrainUpdates() {
    // Simulate small position and speed changes
    return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      id: `tr${Math.floor(Math.random() * 3) + 1}`,
      coordinates: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.006 + (Math.random() - 0.5) * 0.01,
      },
      speed: Math.max(0, 60 + (Math.random() - 0.5) * 20),
      delay: Math.max(0, Math.floor(Math.random() * 15)),
    }))
  }

  private generateKPIUpdates() {
    return {
      onTimePerformance: Math.max(80, Math.min(95, 87.5 + (Math.random() - 0.5) * 4)),
      systemEfficiency: Math.max(85, Math.min(98, 91.2 + (Math.random() - 0.5) * 2)),
      activeTrains: Math.floor(Math.random() * 5) + 20,
      delayedTrains: Math.floor(Math.random() * 8) + 2,
    }
  }

  private generateRandomAlert() {
    const types = ["delay", "maintenance", "weather", "emergency"]
    const severities = ["low", "medium", "high"]
    const type = types[Math.floor(Math.random() * types.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    return {
      id: `al${Date.now()}`,
      type,
      severity,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
      description: `Automated ${type} alert generated at ${new Date().toLocaleTimeString()}`,
      affectedTrains: [`tr${Math.floor(Math.random() * 3) + 1}`],
      affectedStations: [`st${Math.floor(Math.random() * 4) + 1}`],
      createdAt: new Date(),
      createdBy: "system",
    }
  }

  private generateOptimizationSuggestion() {
    const types = ["reroute", "reschedule", "priority_change", "platform_change"]
    const type = types[Math.floor(Math.random() * types.length)]

    return {
      id: `opt${Date.now()}`,
      type,
      trainId: `tr${Math.floor(Math.random() * 3) + 1}`,
      description: `AI suggests ${type.replace("_", " ")} to improve efficiency`,
      estimatedImprovement: `Reduce delay by ${Math.floor(Math.random() * 10) + 3} minutes`,
      confidence: 0.6 + Math.random() * 0.3,
      createdAt: new Date(),
      status: "pending" as const,
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(` Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error("Max reconnection attempts reached")
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(event)
        }
      }
    }
  }

  public off(event: string, callback?: (data: any) => void) {
    if (callback) {
      const listeners = this.listeners.get(event)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(event)
        }
      }
    } else {
      this.listeners.delete(event)
    }
  }

  public send(message: WebSocketMessage) {
    // In a real implementation, this would send to the WebSocket server
    console.log(" Sending WebSocket message:", message)
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }
}

// Singleton instance
let wsInstance: TrainControlWebSocket | null = null

export const getWebSocketInstance = () => {
  if (!wsInstance) {
    wsInstance = new TrainControlWebSocket()
  }
  return wsInstance
}
