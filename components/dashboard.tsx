"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { PermissionManager } from "@/lib/permissions"
import { PermissionGuard } from "./permission-guard"
import { DashboardHeader } from "./dashboard/dashboard-header"
import { KPICards } from "./dashboard/kpi-cards"
import { TrainMap } from "./dashboard/train-map"
import { TrainList } from "./dashboard/train-list"
import { AlertsPanel } from "./dashboard/alerts-panel"
import { ScheduleGantt } from "./dashboard/schedule-gantt"
import { OptimizationPanel } from "./dashboard/optimization-panel"
import { RealTimeNotifications } from "./real-time-notifications"
import { RoleBasedDashboard } from "./role-based-dashboard"
import { AuditLogsPanel } from "./dashboard/audit-logs-panel"
import { SimulationPanel } from "./dashboard/simulation-panel"
import { EnhancedKPIDashboard } from "./dashboard/enhanced-kpi-dashboard"
import { ConfigurableAlerts } from "./dashboard/configurable-alerts"
import { mockKPIs, mockTrains, mockAlerts, mockOptimizationSuggestions } from "@/lib/mock-data"
import { logUserAction } from "@/lib/audit-logger"
import type { Train, Alert, KPI, OptimizationSuggestion } from "@/lib/types"

export function Dashboard() {
  const { user } = useAuth()
  const { kpiUpdates, trainUpdates } = useWebSocket()
  const [trains, setTrains] = useState<Train[]>(mockTrains)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [kpis, setKPIs] = useState<KPI>(mockKPIs)
  const [optimizationSuggestions, setOptimizationSuggestions] =
    useState<OptimizationSuggestion[]>(mockOptimizationSuggestions)
  const [selectedView, setSelectedView] = useState<
    "overview" | "trains" | "schedule" | "optimization" | "access" | "analytics" | "simulation" | "audit" | "alerts"
  >("overview")

  // Filter data based on user permissions and section access
  const filteredTrains = PermissionManager.filterDataByAccess(user, trains)
  const filteredAlerts = PermissionManager.filterDataByAccess(user, alerts)

  useEffect(() => {
    if (user) {
      logUserAction(user, "Dashboard Access", `User accessed dashboard with ${selectedView} view`)
    }
  }, [user, selectedView])

  useEffect(() => {
    if (kpiUpdates) {
      setKPIs((prev) => ({ ...prev, ...kpiUpdates }))
    }
  }, [kpiUpdates])

  useEffect(() => {
    if (trainUpdates.length > 0) {
      const latestUpdate = trainUpdates[trainUpdates.length - 1]
      if (latestUpdate.trains) {
        setTrains((prevTrains) =>
          prevTrains.map((train) => {
            const update = latestUpdate.trains.find((u: any) => u.id === train.id)
            return update ? { ...train, ...update } : train
          }),
        )
      }
    }
  }, [trainUpdates])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update train positions and statuses
      setTrains((prevTrains) =>
        prevTrains.map((train) => ({
          ...train,
          // Simulate movement
          coordinates: {
            lat: train.coordinates.lat + (Math.random() - 0.5) * 0.001,
            lng: train.coordinates.lng + (Math.random() - 0.5) * 0.001,
          },
          // Simulate speed changes
          speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
        })),
      )

      // Update KPIs
      setKPIs((prevKPIs) => ({
        ...prevKPIs,
        onTimePerformance: Math.max(80, Math.min(95, prevKPIs.onTimePerformance + (Math.random() - 0.5) * 2)),
        systemEfficiency: Math.max(85, Math.min(98, prevKPIs.systemEfficiency + (Math.random() - 0.5) * 1)),
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader user={user!} selectedView={selectedView} onViewChange={setSelectedView} />

      <RealTimeNotifications />

      <main className="p-6 space-y-6">
        {selectedView === "overview" && (
          <>
            <PermissionGuard permission="view_dashboard">
              <KPICards kpis={kpis} />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <TrainMap trains={filteredTrains} />
                </div>
                <div>
                  <AlertsPanel alerts={filteredAlerts} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TrainList trains={filteredTrains} />
                <PermissionGuard permission="view_optimization">
                  <OptimizationPanel suggestions={optimizationSuggestions} />
                </PermissionGuard>
              </div>
            </PermissionGuard>
          </>
        )}

        {selectedView === "trains" && (
          <PermissionGuard permission="view_trains">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TrainMap trains={filteredTrains} />
              </div>
              <div>
                <TrainList trains={filteredTrains} showDetails />
              </div>
            </div>
          </PermissionGuard>
        )}

        {selectedView === "schedule" && (
          <PermissionGuard permission="view_trains">
            <ScheduleGantt trains={filteredTrains} />
          </PermissionGuard>
        )}

        {selectedView === "optimization" && (
          <PermissionGuard permission="view_optimization">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <OptimizationPanel suggestions={optimizationSuggestions} expanded />
              <div className="space-y-6">
                <KPICards kpis={kpis} />
                <AlertsPanel alerts={filteredAlerts} />
              </div>
            </div>
          </PermissionGuard>
        )}

        {selectedView === "analytics" && (
          <PermissionGuard permission="view_dashboard">
            <EnhancedKPIDashboard kpis={kpis} />
          </PermissionGuard>
        )}

        {selectedView === "simulation" && (
          <PermissionGuard permission="view_optimization">
            <SimulationPanel />
          </PermissionGuard>
        )}

        {selectedView === "audit" && (
          <PermissionGuard permission="system_admin">
            <AuditLogsPanel />
          </PermissionGuard>
        )}

        {selectedView === "alerts" && (
          <PermissionGuard permission="manage_alerts">
            <ConfigurableAlerts />
          </PermissionGuard>
        )}

        {selectedView === "access" && <RoleBasedDashboard />}
      </main>
    </div>
  )
}
