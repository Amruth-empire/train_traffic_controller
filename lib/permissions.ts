import type { User } from "./types"

export type Permission =
  | "view_dashboard"
  | "view_trains"
  | "control_trains"
  | "manage_alerts"
  | "resolve_alerts"
  | "view_optimization"
  | "implement_optimization"
  | "manage_users"
  | "system_admin"
  | "emergency_control"
  | "view_analytics"
  | "export_data"
  | "view_audit_logs"
  | "run_simulations"
  | "configure_alerts"

export type RolePermissions = {
  [K in User["role"]]: Permission[]
}

export const ROLE_PERMISSIONS: RolePermissions = {
  viewer: ["view_dashboard", "view_trains", "view_optimization", "view_analytics"],
  controller: [
    "view_dashboard",
    "view_trains",
    "control_trains",
    "manage_alerts",
    "resolve_alerts",
    "view_optimization",
    "implement_optimization",
    "view_analytics",
    "emergency_control",
    "run_simulations",
    "configure_alerts",
  ],
  admin: [
    "view_dashboard",
    "view_trains",
    "control_trains",
    "manage_alerts",
    "resolve_alerts",
    "view_optimization",
    "implement_optimization",
    "manage_users",
    "system_admin",
    "emergency_control",
    "view_analytics",
    "export_data",
    "view_audit_logs",
    "run_simulations",
    "configure_alerts",
  ],
}

export class PermissionManager {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false

    const userPermissions = ROLE_PERMISSIONS[user.role]
    return userPermissions.includes(permission)
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    if (!user) return false

    return permissions.some((permission) => this.hasPermission(user, permission))
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    if (!user) return false

    return permissions.every((permission) => this.hasPermission(user, permission))
  }

  /**
   * Get all permissions for a user
   */
  static getUserPermissions(user: User | null): Permission[] {
    if (!user) return []

    return ROLE_PERMISSIONS[user.role]
  }

  /**
   * Check if a user can access a specific section
   */
  static canAccessSection(user: User | null, section: string): boolean {
    if (!user) return false

    // Section-based access control
    if (user.section && section !== user.section && user.role !== "admin") {
      return false
    }

    return true
  }

  /**
   * Filter data based on user permissions and section access
   */
  static filterDataByAccess<T extends { section?: string }>(user: User | null, data: T[]): T[] {
    if (!user) return []

    // Admins can see all data
    if (user.role === "admin") return data

    // Filter by user's section if they have one
    if (user.section) {
      return data.filter((item) => !item.section || item.section === user.section)
    }

    return data
  }

  /**
   * Get role hierarchy level (higher number = more permissions)
   */
  static getRoleLevel(role: User["role"]): number {
    switch (role) {
      case "viewer":
        return 1
      case "controller":
        return 2
      case "admin":
        return 3
      default:
        return 0
    }
  }

  /**
   * Check if user can perform action on another user
   */
  static canManageUser(currentUser: User | null, targetUser: User): boolean {
    if (!currentUser) return false

    // Only admins can manage users
    if (!this.hasPermission(currentUser, "manage_users")) return false

    // Can't manage users with equal or higher role level
    const currentLevel = this.getRoleLevel(currentUser.role)
    const targetLevel = this.getRoleLevel(targetUser.role)

    return currentLevel > targetLevel
  }
}
