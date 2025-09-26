"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { PermissionManager, type Permission } from "@/lib/permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  section?: string
  fallback?: React.ReactNode
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  section,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth()

  // Check single permission
  if (permission && !PermissionManager.hasPermission(user, permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? PermissionManager.hasAllPermissions(user, permissions)
      : PermissionManager.hasAnyPermission(user, permissions)

    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  // Check section access
  if (section && !PermissionManager.canAccessSection(user, section)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
