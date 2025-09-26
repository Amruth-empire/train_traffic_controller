import type { AuditLog, User } from "./types"

class AuditLogger {
  private logs: AuditLog[] = []

  log(user: User, action: string, details: string, entityType: AuditLog["entityType"], entityId?: string): void {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      action,
      details,
      entityType,
      entityId,
      timestamp: new Date(),
      ipAddress: "127.0.0.1", // Mock IP
      userAgent: navigator.userAgent,
    }

    this.logs.unshift(auditLog)

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000)
    }

    console.log(" Audit log created:", auditLog)
  }

  getLogs(filters?: {
    userId?: string
    entityType?: AuditLog["entityType"]
    startDate?: Date
    endDate?: Date
  }): AuditLog[] {
    let filteredLogs = [...this.logs]

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
    }

    if (filters?.entityType) {
      filteredLogs = filteredLogs.filter((log) => log.entityType === filters.entityType)
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
    }

    return filteredLogs
  }

  getLogsByEntity(entityType: AuditLog["entityType"], entityId: string): AuditLog[] {
    return this.logs.filter((log) => log.entityType === entityType && log.entityId === entityId)
  }
}

export const auditLogger = new AuditLogger()

// Helper functions for common audit actions
export const logUserAction = (user: User, action: string, details: string) => {
  auditLogger.log(user, action, details, "system")
}

export const logTrainAction = (user: User, action: string, trainId: string, details: string) => {
  auditLogger.log(user, action, details, "train", trainId)
}

export const logOptimizationAction = (user: User, action: string, optimizationId: string, details: string) => {
  auditLogger.log(user, action, details, "optimization", optimizationId)
}

export const logAlertAction = (user: User, action: string, alertId: string, details: string) => {
  auditLogger.log(user, action, details, "alert", alertId)
}
