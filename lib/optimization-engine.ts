import type { Train, Station, OptimizationSuggestion, Alert } from "./types"

export interface OptimizationContext {
  trains: Train[]
  stations: Station[]
  alerts: Alert[]
  currentTime: Date
}

export interface OptimizationResult {
  suggestions: OptimizationSuggestion[]
  metrics: {
    totalDelayReduction: number
    affectedTrains: number
    confidenceScore: number
    implementationComplexity: "low" | "medium" | "high"
  }
}

export class TrainOptimizationEngine {
  private readonly DELAY_THRESHOLD = 5 // minutes
  private readonly CAPACITY_THRESHOLD = 0.8 // 80%
  private readonly PRIORITY_WEIGHT = 0.3
  private readonly DELAY_WEIGHT = 0.4
  private readonly CAPACITY_WEIGHT = 0.3

  /**
   * Main optimization function that analyzes current state and generates suggestions
   */
  public optimize(context: OptimizationContext): OptimizationResult {
    const suggestions: OptimizationSuggestion[] = []

    // Analyze different optimization opportunities
    suggestions.push(...this.analyzeDelayOptimization(context))
    suggestions.push(...this.analyzeCapacityOptimization(context))
    suggestions.push(...this.analyzePriorityOptimization(context))
    suggestions.push(...this.analyzeRouteOptimization(context))

    // Sort suggestions by potential impact and confidence
    const sortedSuggestions = suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5) // Limit to top 5 suggestions

    const metrics = this.calculateOptimizationMetrics(sortedSuggestions, context)

    return {
      suggestions: sortedSuggestions,
      metrics,
    }
  }

  /**
   * Analyze trains with delays and suggest optimizations
   */
  private analyzeDelayOptimization(context: OptimizationContext): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const delayedTrains = context.trains.filter((train) => train.delay > this.DELAY_THRESHOLD)

    for (const train of delayedTrains) {
      // Suggest rerouting for heavily delayed trains
      if (train.delay > 15) {
        suggestions.push({
          id: `opt_delay_${train.id}_${Date.now()}`,
          type: "reroute",
          trainId: train.id,
          description: `Reroute ${train.number} via alternate track to bypass congestion`,
          estimatedImprovement: `Reduce delay from ${train.delay}min to ${Math.max(2, train.delay - 12)}min`,
          confidence: this.calculateRerouteConfidence(train, context),
          createdAt: new Date(),
          status: "pending",
        })
      }

      // Suggest priority increase for passenger trains with moderate delays
      if (train.type === "passenger" && train.delay > 8 && train.priority < 8) {
        suggestions.push({
          id: `opt_priority_${train.id}_${Date.now()}`,
          type: "priority_change",
          trainId: train.id,
          description: `Increase priority of passenger train ${train.number} to minimize passenger impact`,
          estimatedImprovement: `Reduce passenger delay by ${Math.floor(train.delay * 0.4)}min`,
          confidence: this.calculatePriorityConfidence(train, context),
          createdAt: new Date(),
          status: "pending",
        })
      }

      // Suggest rescheduling for freight trains with low priority
      if (train.type === "freight" && train.delay > 20 && train.priority < 5) {
        suggestions.push({
          id: `opt_reschedule_${train.id}_${Date.now()}`,
          type: "reschedule",
          trainId: train.id,
          description: `Reschedule freight train ${train.number} to off-peak hours`,
          estimatedImprovement: `Clear congestion, reduce system-wide delays by 15%`,
          confidence: this.calculateRescheduleConfidence(train, context),
          createdAt: new Date(),
          status: "pending",
        })
      }
    }

    return suggestions
  }

  /**
   * Analyze station capacity and suggest optimizations
   */
  private analyzeCapacityOptimization(context: OptimizationContext): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const overcrowdedStations = context.stations.filter(
      (station) => station.currentOccupancy / station.capacity > this.CAPACITY_THRESHOLD,
    )

    for (const station of overcrowdedStations) {
      // Find trains heading to this station
      const incomingTrains = context.trains.filter((train) => train.destination === station.name)

      for (const train of incomingTrains) {
        suggestions.push({
          id: `opt_platform_${train.id}_${Date.now()}`,
          type: "platform_change",
          trainId: train.id,
          description: `Redirect ${train.number} to alternate platform at ${station.name} to reduce congestion`,
          estimatedImprovement: `Reduce station congestion by 20%, improve boarding efficiency`,
          confidence: this.calculatePlatformChangeConfidence(train, station, context),
          createdAt: new Date(),
          status: "pending",
        })
      }
    }

    return suggestions
  }

  /**
   * Analyze train priorities and suggest adjustments
   */
  private analyzePriorityOptimization(context: OptimizationContext): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // Find express trains with low priority that should be prioritized
    const expressPriorityTrains = context.trains.filter(
      (train) => train.type === "express" && train.priority < 7 && train.delay > 0,
    )

    for (const train of expressPriorityTrains) {
      suggestions.push({
        id: `opt_express_priority_${train.id}_${Date.now()}`,
        type: "priority_change",
        trainId: train.id,
        description: `Increase priority of express train ${train.number} to maintain schedule integrity`,
        estimatedImprovement: `Reduce delay by ${Math.floor(train.delay * 0.6)}min, improve passenger satisfaction`,
        confidence: 0.85,
        createdAt: new Date(),
        status: "pending",
      })
    }

    return suggestions
  }

  /**
   * Analyze routes and suggest optimizations
   */
  private analyzeRouteOptimization(context: OptimizationContext): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // Find trains that could benefit from route optimization
    const routeOptimizationCandidates = context.trains.filter((train) => train.delay > 10 && train.status === "running")

    for (const train of routeOptimizationCandidates) {
      // Check if there are alerts affecting the current route
      const routeAlerts = context.alerts.filter((alert) => alert.affectedTrains.includes(train.id) && !alert.resolvedAt)

      if (routeAlerts.length > 0) {
        suggestions.push({
          id: `opt_route_${train.id}_${Date.now()}`,
          type: "reroute",
          trainId: train.id,
          description: `Reroute ${train.number} to avoid ${routeAlerts[0].type} affecting current path`,
          estimatedImprovement: `Avoid ${routeAlerts[0].type}, reduce delay by ${Math.floor(train.delay * 0.7)}min`,
          confidence: this.calculateRouteOptimizationConfidence(train, routeAlerts, context),
          createdAt: new Date(),
          status: "pending",
        })
      }
    }

    return suggestions
  }

  /**
   * Calculate confidence score for rerouting suggestions
   */
  private calculateRerouteConfidence(train: Train, context: OptimizationContext): number {
    let confidence = 0.6

    // Higher confidence for trains with significant delays
    if (train.delay > 20) confidence += 0.2
    if (train.delay > 30) confidence += 0.1

    // Higher confidence for high-priority trains
    if (train.priority >= 7) confidence += 0.1

    // Lower confidence if there are many alerts in the system
    const activeAlerts = context.alerts.filter((alert) => !alert.resolvedAt)
    if (activeAlerts.length > 3) confidence -= 0.1

    return Math.min(0.95, Math.max(0.3, confidence))
  }

  /**
   * Calculate confidence score for priority change suggestions
   */
  private calculatePriorityConfidence(train: Train, context: OptimizationContext): number {
    let confidence = 0.7

    // Higher confidence for passenger trains
    if (train.type === "passenger") confidence += 0.1
    if (train.type === "express") confidence += 0.15

    // Consider current system load
    const delayedTrains = context.trains.filter((t) => t.delay > 0)
    const systemLoad = delayedTrains.length / context.trains.length

    if (systemLoad > 0.3) confidence += 0.1 // High system load benefits from priority optimization

    return Math.min(0.9, Math.max(0.4, confidence))
  }

  /**
   * Calculate confidence score for rescheduling suggestions
   */
  private calculateRescheduleConfidence(train: Train, context: OptimizationContext): number {
    let confidence = 0.5

    // Higher confidence for freight trains (more flexible scheduling)
    if (train.type === "freight") confidence += 0.2

    // Higher confidence during peak hours
    const currentHour = context.currentTime.getHours()
    if (currentHour >= 7 && currentHour <= 9) confidence += 0.15 // Morning rush
    if (currentHour >= 17 && currentHour <= 19) confidence += 0.15 // Evening rush

    return Math.min(0.85, Math.max(0.3, confidence))
  }

  /**
   * Calculate confidence score for platform change suggestions
   */
  private calculatePlatformChangeConfidence(train: Train, station: Station, context: OptimizationContext): number {
    let confidence = 0.6

    // Higher confidence if station is significantly overcrowded
    const occupancyRate = station.currentOccupancy / station.capacity
    if (occupancyRate > 0.9) confidence += 0.2

    // Consider available platforms
    if (station.platforms > 4) confidence += 0.1

    return Math.min(0.8, Math.max(0.4, confidence))
  }

  /**
   * Calculate confidence score for route optimization suggestions
   */
  private calculateRouteOptimizationConfidence(train: Train, alerts: Alert[], context: OptimizationContext): number {
    let confidence = 0.65

    // Higher confidence if alerts are severe
    const highSeverityAlerts = alerts.filter((alert) => alert.severity === "high" || alert.severity === "critical")
    confidence += highSeverityAlerts.length * 0.1

    // Higher confidence for high-priority trains
    if (train.priority >= 7) confidence += 0.1

    return Math.min(0.9, Math.max(0.4, confidence))
  }

  /**
   * Calculate overall optimization metrics
   */
  private calculateOptimizationMetrics(
    suggestions: OptimizationSuggestion[],
    context: OptimizationContext,
  ): OptimizationResult["metrics"] {
    const totalDelayReduction = suggestions.reduce((sum, suggestion) => {
      // Extract estimated delay reduction from description
      const match = suggestion.estimatedImprovement.match(/(\d+)min/)
      return sum + (match ? Number.parseInt(match[1]) : 0)
    }, 0)

    const affectedTrains = new Set(suggestions.map((s) => s.trainId)).size

    const confidenceScore =
      suggestions.length > 0 ? suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length : 0

    // Determine implementation complexity based on suggestion types
    const complexTypes = ["reroute", "reschedule"]
    const hasComplexSuggestions = suggestions.some((s) => complexTypes.includes(s.type))
    const implementationComplexity = hasComplexSuggestions ? "high" : suggestions.length > 3 ? "medium" : "low"

    return {
      totalDelayReduction,
      affectedTrains,
      confidenceScore,
      implementationComplexity,
    }
  }

  /**
   * Simulate the implementation of an optimization suggestion
   */
  public simulateImplementation(
    suggestion: OptimizationSuggestion,
    context: OptimizationContext,
  ): {
    success: boolean
    actualImprovement: string
    sideEffects: string[]
  } {
    const train = context.trains.find((t) => t.id === suggestion.trainId)
    if (!train) {
      return {
        success: false,
        actualImprovement: "Train not found",
        sideEffects: [],
      }
    }

    const sideEffects: string[] = []
    let actualImprovement = suggestion.estimatedImprovement

    switch (suggestion.type) {
      case "reroute":
        // Simulate reroute implementation
        if (Math.random() > 0.1) {
          // 90% success rate
          const delayReduction = Math.floor(train.delay * 0.6)
          actualImprovement = `Reduced delay by ${delayReduction}min`
          if (Math.random() > 0.7) {
            sideEffects.push("Minor delay to 1 other train due to track switching")
          }
        } else {
          return {
            success: false,
            actualImprovement: "Reroute failed due to track availability",
            sideEffects: [],
          }
        }
        break

      case "priority_change":
        // Simulate priority change
        actualImprovement = `Priority increased, estimated ${Math.floor(train.delay * 0.4)}min improvement`
        if (Math.random() > 0.8) {
          sideEffects.push("Lower priority trains may experience slight delays")
        }
        break

      case "reschedule":
        // Simulate rescheduling
        actualImprovement = "Train rescheduled to off-peak hours"
        sideEffects.push("Passenger notifications sent", "Alternative transport arranged")
        break

      case "platform_change":
        // Simulate platform change
        actualImprovement = "Platform changed, boarding efficiency improved by 15%"
        if (Math.random() > 0.9) {
          sideEffects.push("Brief passenger confusion during transition")
        }
        break
    }

    return {
      success: true,
      actualImprovement,
      sideEffects,
    }
  }
}

// Singleton instance
let optimizationEngine: TrainOptimizationEngine | null = null

export const getOptimizationEngine = () => {
  if (!optimizationEngine) {
    optimizationEngine = new TrainOptimizationEngine()
  }
  return optimizationEngine
}
