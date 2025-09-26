// Core data types for the train traffic controller system

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "controller" | "viewer"
  section?: string // Railway section they control
  createdAt: Date
}

export interface Train {
  id: string
  number: string
  type: "passenger" | "freight" | "express"
  status: "scheduled" | "running" | "delayed" | "cancelled" | "completed"
  currentLocation: string
  destination: string
  origin: string
  scheduledDeparture: Date
  actualDeparture?: Date
  scheduledArrival: Date
  estimatedArrival?: Date
  delay: number // in minutes
  priority: number // 1-10, higher is more priority
  capacity: number
  occupancy: number
  speed: number // current speed in km/h
  maxSpeed: number
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Station {
  id: string
  name: string
  code: string
  coordinates: {
    lat: number
    lng: number
  }
  platforms: number
  capacity: number
  currentOccupancy: number
  section: string
}

export interface Schedule {
  id: string
  trainId: string
  stationId: string
  scheduledTime: Date
  actualTime?: Date
  type: "departure" | "arrival"
  platform?: string
  delay: number
}

export interface Alert {
  id: string
  type: "delay" | "cancellation" | "emergency" | "maintenance" | "weather"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  affectedTrains: string[]
  affectedStations: string[]
  createdAt: Date
  resolvedAt?: Date
  createdBy: string
}

export interface KPI {
  onTimePerformance: number // percentage
  averageDelay: number // minutes
  totalTrainsToday: number
  activeTrains: number
  delayedTrains: number
  cancelledTrains: number
  stationCapacityUtilization: number // percentage
  systemEfficiency: number // percentage
}

export interface OptimizationSuggestion {
  id: string
  type: "reroute" | "reschedule" | "priority_change" | "platform_change"
  trainId: string
  description: string
  estimatedImprovement: string
  confidence: number // 0-1
  createdAt: Date
  status: "pending" | "accepted" | "rejected" | "implemented"
}

export interface WebSocketMessage {
  type: "train_update" | "alert" | "schedule_change" | "optimization_suggestion"
  data: any
  timestamp: Date
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  entityType: "train" | "alert" | "optimization" | "system"
  entityId?: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export interface SimulationScenario {
  id: string
  name: string
  description: string
  parameters: {
    trainDelays?: { trainId: string; additionalDelay: number }[]
    stationClosures?: string[]
    weatherConditions?: "normal" | "rain" | "snow" | "fog"
    maintenanceWindows?: { stationId: string; duration: number }[]
  }
  results?: SimulationResults
  createdAt: Date
  createdBy: string
}

export interface SimulationResults {
  totalDelay: number
  affectedTrains: number
  passengerImpact: number
  alternativeRoutes: number
  estimatedCost: number
  recommendations: string[]
}

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: {
    metric: "delay" | "capacity" | "speed" | "efficiency"
    operator: ">" | "<" | "=" | ">=" | "<="
    threshold: number
    duration?: number // minutes
  }
  actions: {
    notify: boolean
    escalate: boolean
    autoResolve: boolean
  }
  isActive: boolean
  createdBy: string
  createdAt: Date
}
