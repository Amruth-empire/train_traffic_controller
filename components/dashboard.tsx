"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWebSocket } from "@/contexts/websocket-context";
import { PermissionManager } from "@/lib/permissions";
import { PermissionGuard } from "./permission-guard";
import { DashboardHeader } from "./dashboard/dashboard-header";
import { KPICards } from "./dashboard/kpi-cards";
import { TrainMap } from "./dashboard/train-map";
import { TrainList } from "./dashboard/train-list";
import { TrackVisualization } from "./dashboard/track-visualization";
import { AlertsPanel } from "./dashboard/alerts-panel";
import { ScheduleGantt } from "./dashboard/schedule-gantt";
import { OptimizationPanel } from "./dashboard/optimization-panel";
import { RealTimeNotifications } from "./real-time-notifications";
import { RoleBasedDashboard } from "./role-based-dashboard";
import { AuditLogsPanel } from "./dashboard/audit-logs-panel";
import { SimulationPanel } from "./dashboard/simulation-panel";
import { EnhancedKPIDashboard } from "./dashboard/enhanced-kpi-dashboard";
import { ConfigurableAlerts } from "./dashboard/configurable-alerts";
import { ApiStatusNotification } from "./api-status-notification";
import {
  mockKPIs,
  mockTrains,
  mockAlerts,
  mockOptimizationSuggestions,
  mockTrackSections,
} from "@/lib/mock-data";
import { logUserAction } from "@/lib/audit-logger";
import type {
  Train,
  Alert,
  KPI,
  OptimizationSuggestion,
  TrackSection,
} from "@/lib/types";

// Helper to ensure dates are properly converted
const ensureDatesInTrains = (trainsData: Train[]) => {
  return trainsData.map(train => ({
    ...train,
    scheduledDeparture: new Date(train.scheduledDeparture),
    actualDeparture: train.actualDeparture ? new Date(train.actualDeparture) : undefined,
    scheduledArrival: new Date(train.scheduledArrival),
    estimatedArrival: train.estimatedArrival ? new Date(train.estimatedArrival) : undefined,
  }));
};

export function Dashboard() {
  const { user } = useAuth();
  const { kpiUpdates, trainUpdates } = useWebSocket();
  const [trains, setTrains] = useState<Train[]>(() => ensureDatesInTrains(mockTrains));
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [kpis, setKPIs] = useState<KPI>(mockKPIs);
  const [trackSections, setTrackSections] =
    useState<TrackSection[]>(mockTrackSections);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<
    OptimizationSuggestion[]
  >(mockOptimizationSuggestions);
  const [selectedView, setSelectedView] = useState<
    | "overview"
    | "trains"
    | "schedule"
    | "optimization"
    | "access"
    | "analytics"
    | "simulation"
    | "audit"
    | "alerts"
  >("overview");
  const [useRealData, setUseRealData] = useState(false);
  const [apiUsage, setApiUsage] = useState({ used: 0, remaining: 20 });
  const [isLoadingRealData, setIsLoadingRealData] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

  // For demo purposes, show all data (can be filtered later based on requirements)
  const filteredTrains = trains;
  const filteredAlerts = alerts;

  // Fetch real train data from IRCTC API
  const fetchRealTrainData = async () => {
    setIsLoadingRealData(true);
    setFetchStatus('fetching');
    
    try {
      console.log("🚂 Fetching real train data from IRCTC API...");
      const startTime = Date.now();
      
      const response = await fetch("/api/trains?real=true");
      const data = await response.json();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (data.success) {
        const trainsWithDates = ensureDatesInTrains(data.data);
        setTrains(trainsWithDates);
        setApiUsage({
          used: data.meta?.apiUsage?.requestsUsed || 0,
          remaining: data.meta?.apiUsage?.requestsRemaining || 20
        });
        setLastFetchTime(new Date());
        setFetchStatus('success');
        
        console.log(`✅ Updated ${data.data.length} trains with real data in ${duration}ms`);
        console.log(`📊 API Usage: ${data.meta?.apiUsage?.requestsUsed || 0}/20 requests used`);
        
        // Show success message
        if (data.meta?.realDataCount > 0) {
          console.log(`🎯 ${data.meta.realDataCount} trains with real IRCTC data, ${data.meta.fallbackDataCount} with fallback data`);
        }
        
        return true;
      } else {
        setFetchStatus('error');
        console.error("❌ API returned unsuccessful response:", data);
      }
    } catch (error) {
      setFetchStatus('error');
      console.error("❌ Failed to fetch real train data:", error);
    } finally {
      setIsLoadingRealData(false);
    }
    return false;
  };

  useEffect(() => {
    if (user) {
      logUserAction(
        user,
        "Dashboard Access",
        `User accessed dashboard with ${selectedView} view`
      );
    }
  }, [user, selectedView]);

  // Load real data on component mount if available
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if we should use real data (maybe from localStorage preference)
      const savedPreference = localStorage.getItem('useRealTrainData');
      if (savedPreference === 'true') {
        setUseRealData(true);
        await fetchRealTrainData();
      }
    };
    
    loadInitialData();
  }, []);

  // Toggle real data usage
  const toggleRealData = async () => {
    if (!useRealData) {
      const success = await fetchRealTrainData();
      if (success) {
        setUseRealData(true);
        localStorage.setItem('useRealTrainData', 'true');
      }
    } else {
      setUseRealData(false);
      setTrains(ensureDatesInTrains(mockTrains)); // Revert to mock data with proper dates
      setFetchStatus('idle');
      localStorage.setItem('useRealTrainData', 'false');
    }
  };

  // Refresh real data
  const refreshRealData = async () => {
    if (useRealData && !isLoadingRealData) {
      await fetchRealTrainData();
    }
  };

  useEffect(() => {
    if (kpiUpdates) {
      setKPIs((prev) => ({ ...prev, ...kpiUpdates }));
    }
  }, [kpiUpdates]);

  useEffect(() => {
    if (trainUpdates.length > 0) {
      const latestUpdate = trainUpdates[trainUpdates.length - 1];
      if (latestUpdate.trains) {
        setTrains((prevTrains) =>
          prevTrains.map((train) => {
            const update = latestUpdate.trains.find(
              (u: any) => u.id === train.id
            );
            return update ? { ...train, ...update } : train;
          })
        );
      }
    }
  }, [trainUpdates]);

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
        }))
      );

      // Update KPIs
      setKPIs((prevKPIs) => ({
        ...prevKPIs,
        onTimePerformance: Math.max(
          80,
          Math.min(95, prevKPIs.onTimePerformance + (Math.random() - 0.5) * 2)
        ),
        systemEfficiency: Math.max(
          85,
          Math.min(98, prevKPIs.systemEfficiency + (Math.random() - 0.5) * 1)
        ),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white">
      <DashboardHeader
        user={user!}
        selectedView={selectedView}
        onViewChange={setSelectedView}
        useRealData={useRealData}
        onToggleRealData={toggleRealData}
        apiUsage={apiUsage}
        isLoadingRealData={isLoadingRealData}
        fetchStatus={fetchStatus}
        lastFetchTime={lastFetchTime}
        onRefreshRealData={refreshRealData}
      />

      <RealTimeNotifications />
      
      <ApiStatusNotification 
        fetchStatus={fetchStatus}
        useRealData={useRealData}
        isLoadingRealData={isLoadingRealData}
        apiUsage={apiUsage}
      />

      <main className="p-6 space-y-6">
        {selectedView === "overview" && (
          <>
            <PermissionGuard
              permission="view_dashboard"
              fallback={
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
                  No permission to view dashboard
                </div>
              }
            >
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
                <TrainList 
                  trains={filteredTrains} 
                  isLoading={isLoadingRealData}
                  useRealData={useRealData}
                />
                <PermissionGuard permission="view_optimization">
                  <OptimizationPanel suggestions={optimizationSuggestions} />
                </PermissionGuard>
              </div>
            </PermissionGuard>
          </>
        )}

        {selectedView === "trains" && (
          <PermissionGuard permission="view_trains">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <TrackVisualization
                  trackSections={trackSections}
                  trains={filteredTrains}
                  onTrackClick={(track) => {
                    if (user) {
                      logUserAction(
                        user,
                        "track_view",
                        `Viewed track section ${track.name} (${track.id})`
                      );
                    }
                  }}
                />
              </div>
              <div>
                <TrainList 
                  trains={filteredTrains} 
                  showDetails 
                  isLoading={isLoadingRealData}
                  useRealData={useRealData}
                />
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
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <OptimizationPanel
                  suggestions={optimizationSuggestions}
                  expanded
                />
              </div>
              <div className="xl:col-span-3 space-y-4">
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
  );
}
