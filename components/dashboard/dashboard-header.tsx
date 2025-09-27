"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/permission-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileDropdown } from "@/components/profile-dropdown";
import {
  Train,
  Settings,
  Bell,
  BarChart3,
  Calendar,
  Zap,
  Shield,
  TrendingUp,
  Play,
  FileText,
  AlertTriangle,
  Menu,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: User;
  selectedView:
    | "overview"
    | "trains"
    | "schedule"
    | "optimization"
    | "access"
    | "analytics"
    | "simulation"
    | "audit"
    | "alerts";
  onViewChange: (
    view:
      | "overview"
      | "trains"
      | "schedule"
      | "optimization"
      | "access"
      | "analytics"
      | "simulation"
      | "audit"
      | "alerts"
  ) => void;
  useRealData?: boolean;
  onToggleRealData?: () => void;
  apiUsage?: { used: number; remaining: number };
  isLoadingRealData?: boolean;
  fetchStatus?: 'idle' | 'fetching' | 'success' | 'error';
  lastFetchTime?: Date | null;
  onRefreshRealData?: () => void;
}

export function DashboardHeader({
  user,
  selectedView,
  onViewChange,
  useRealData = false,
  onToggleRealData,
  apiUsage = { used: 0, remaining: 20 },
  isLoadingRealData = false,
  fetchStatus = 'idle',
  lastFetchTime,
  onRefreshRealData,
}: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const views = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: BarChart3,
      permission: "view_dashboard",
    },
    {
      id: "trains" as const,
      label: "Trains",
      icon: Train,
      permission: "view_trains",
    },
    {
      id: "schedule" as const,
      label: "Schedule",
      icon: Calendar,
      permission: "view_trains",
    },
    {
      id: "optimization" as const,
      label: "AI Optimization",
      icon: Zap,
      permission: "view_optimization",
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: TrendingUp,
      permission: "view_dashboard",
    },
    {
      id: "simulation" as const,
      label: "Simulation",
      icon: Play,
      permission: "view_optimization",
    },
    {
      id: "alerts" as const,
      label: "Alert Rules",
      icon: AlertTriangle,
      permission: "manage_alerts",
    },
    {
      id: "audit" as const,
      label: "Audit Logs",
      icon: FileText,
      permission: "system_admin",
    },
  ];

  return (
    <>
      <header className="bg-white text-slate-900 border-b border-slate-200 px-4 py-3 transition-colors duration-300 dark:bg-slate-800 dark:text-white dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <Train className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
                Railway Control
              </h1>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white block sm:hidden">
                RC
              </h1>
            </div>

            <nav className="hidden lg:flex space-x-0 scrollbar-hidden">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <PermissionGuard
                    key={view.id}
                    permission={view.permission as any}
                  >
                    <Button
                      variant={selectedView === view.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange(view.id)}
                      className={cn(
                        "whitespace-nowrap",
                        selectedView === view.id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="hidden xl:inline">{view.label}</span>
                    </Button>
                  </PermissionGuard>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-slate-500 dark:text-slate-300">
                {new Date().toLocaleTimeString()}
              </span>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            {/* Real Data Toggle */}
            {onToggleRealData && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant={useRealData ? "default" : "outline"}
                    size="sm"
                    onClick={onToggleRealData}
                    disabled={isLoadingRealData}
                    className={cn(
                      "text-xs relative",
                      useRealData
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "text-slate-600 hover:text-slate-900 border-slate-300 dark:text-slate-300 dark:border-slate-600"
                    )}
                  >
                    {isLoadingRealData ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : fetchStatus === 'success' && useRealData ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : fetchStatus === 'error' && useRealData ? (
                      <XCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Train className="h-3 w-3 mr-1" />
                    )}
                    {isLoadingRealData ? "Fetching..." : useRealData ? "Live Data" : "Demo Data"}
                  </Button>

                  {/* Refresh button when using real data */}
                  {useRealData && onRefreshRealData && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onRefreshRealData}
                      disabled={isLoadingRealData}
                      className="p-1 h-7 w-7"
                      title="Refresh real data"
                    >
                      <RefreshCw className={cn(
                        "h-3 w-3",
                        isLoadingRealData && "animate-spin"
                      )} />
                    </Button>
                  )}
                </div>

                {/* API Usage and Status */}
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={apiUsage.remaining < 5 ? "destructive" : "secondary"}
                    className="text-xs px-1 py-0"
                  >
                    {apiUsage.remaining}/20 API calls
                  </Badge>

                  {/* Last fetch time */}
                  {lastFetchTime && useRealData && (
                    <div 
                      className="flex items-center text-xs text-slate-500 dark:text-slate-400"
                      title={`Last updated: ${lastFetchTime.toLocaleString()}`}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.floor((Date.now() - lastFetchTime.getTime()) / 60000)}m ago
                    </div>
                  )}

                  {/* Status indicator */}
                  {useRealData && (
                    <div className="flex items-center">
                      {fetchStatus === 'fetching' && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" title="Fetching data" />
                      )}
                      {fetchStatus === 'success' && (
                        <div className="h-2 w-2 bg-green-500 rounded-full" title="Data loaded successfully" />
                      )}
                      {fetchStatus === 'error' && (
                        <div className="h-2 w-2 bg-red-500 rounded-full" title="Failed to fetch data" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <PermissionGuard permission="system_admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PermissionGuard>

            <ProfileDropdown user={user} />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 lg:hidden">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Train className="h-8 w-8 text-blue-500" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Railway Control
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {views.map((view) => {
                  const Icon = view.icon;
                  return (
                    <PermissionGuard
                      key={view.id}
                      permission={view.permission as any}
                    >
                      <Button
                        variant={selectedView === view.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          selectedView === view.id
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                        )}
                        onClick={() => {
                          onViewChange(view.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {view.label}
                      </Button>
                    </PermissionGuard>
                  );
                })}
              </nav>

              {/* Footer actions */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>

                  <PermissionGuard permission="system_admin">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
