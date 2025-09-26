"use client"

import { useAuth } from "@/contexts/auth-context"
import { PermissionManager } from "@/lib/permissions"
import { PermissionGuard } from "./permission-guard"
import { OptimizationAnalysisPanel } from "./optimization-analysis-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Settings, Eye } from "lucide-react"

export function RoleBasedDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const userPermissions = PermissionManager.getUserPermissions(user)

  return (
    <div className="space-y-6">
      {/* Role Information Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            Access Control Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Current Role</h4>
              <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>{user.role.toUpperCase()}</Badge>
            </div>

            {user.section && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Assigned Section</h4>
                <Badge variant="outline" className="border-slate-500 text-slate-300">
                  {user.section}
                </Badge>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Permissions</h4>
              <span className="text-white font-semibold">{userPermissions.length} granted</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Available Actions</h4>
            <div className="flex flex-wrap gap-2">
              {userPermissions.map((permission) => (
                <Badge key={permission} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {permission.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viewer-specific content */}
        <PermissionGuard permission="view_dashboard">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-500" />
                Viewer Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                You have read-only access to view train operations and system status.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">View live train positions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Monitor system KPIs</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">View optimization suggestions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Controller-specific content */}
        <PermissionGuard permission="control_trains">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Controller Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                You can control train operations and manage alerts in your assigned section.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Control train priorities</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Resolve alerts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Implement AI suggestions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300">Emergency controls</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Admin-specific content */}
        <PermissionGuard permission="system_admin">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-500" />
                System Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                You have full system access including user management and system configuration.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Manage all users</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">System-wide controls</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Export system data</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Configure system settings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* AI Optimization Panel - Only for controllers and admins */}

        <PermissionGuard permission="implement_optimization">
          <OptimizationAnalysisPanel />
        </PermissionGuard>
        
      </div>
    </div>
  )
}

function getRoleBadgeColor(role: string) {
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
