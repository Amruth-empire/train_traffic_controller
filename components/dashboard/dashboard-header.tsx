"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/permission-guard"
import {
  Train,
  LogOut,
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
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/lib/types"

interface DashboardHeaderProps {
  user: User
  selectedView:
    | "overview"
    | "trains"
    | "schedule"
    | "optimization"
    | "access"
    | "analytics"
    | "simulation"
    | "audit"
    | "alerts"
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
      | "alerts",
  ) => void
}

export function DashboardHeader({ user, selectedView, onViewChange }: DashboardHeaderProps) {
  const { logout } = useAuth()

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-600"
      case "controller":
        return "bg-blue-600"
      case "viewer":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const views = [
    { id: "overview" as const, label: "Overview", icon: BarChart3, permission: "view_dashboard" },
    { id: "trains" as const, label: "Trains", icon: Train, permission: "view_trains" },
    { id: "schedule" as const, label: "Schedule", icon: Calendar, permission: "view_trains" },
    { id: "optimization" as const, label: "AI Optimization", icon: Zap, permission: "view_optimization" },
    { id: "analytics" as const, label: "Analytics", icon: TrendingUp, permission: "view_dashboard" },
    { id: "simulation" as const, label: "Simulation", icon: Play, permission: "view_optimization" },
    { id: "alerts" as const, label: "Alert Rules", icon: AlertTriangle, permission: "manage_alerts" },
    { id: "audit" as const, label: "Audit Logs", icon: FileText, permission: "system_admin" },
    { id: "access" as const, label: "Access Control", icon: Shield, permission: "view_dashboard" },
  ]

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Train className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Railway Control</h1>

          <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
            {views.map((view) => {
              const Icon = view.icon
              return (
                <PermissionGuard key={view.id} permission={view.permission as any}>
                  <Button
                    variant={selectedView === view.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(view.id)}
                    className={
                      selectedView === view.id
                        ? "bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                        : "text-slate-300 hover:text-white hover:bg-slate-700 whitespace-nowrap"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {view.label}
                  </Button>
                </PermissionGuard>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-300">{new Date().toLocaleTimeString()}</span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>

          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>

          <PermissionGuard permission="system_admin">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </PermissionGuard>

          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700 rounded-lg">
            <span className="text-sm text-white">{user.name}</span>
            <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>{user.role.toUpperCase()}</Badge>
            {user.section && (
              <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                {user.section}
              </Badge>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={logout} className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
