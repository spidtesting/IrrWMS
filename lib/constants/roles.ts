import type { UserRole } from "@/types/auth";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  MANAGER: 70,
  SUPERVISOR: 60,
  STAFF: 40,
  VIEWER: 10,
};

export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  dashboard: ["VIEWER", "STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  inventory: ["VIEWER", "STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "goods-received": ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "goods-issued": ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "purchase-orders": ["VIEWER", "STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "stock-entry": ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "physical-count": ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  "damage-reports": ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  kpi: ["SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  reports: ["SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  staff: ["SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  warehouse: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  suppliers: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  "audit-logs": ["ADMIN", "SUPER_ADMIN"],
  notifications: ["VIEWER", "STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  settings: ["ADMIN", "SUPER_ADMIN"],
  inbound: ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  outbound: ["STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  orders: ["VIEWER", "STAFF", "SUPERVISOR", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  warehouses: ["MANAGER", "ADMIN", "SUPER_ADMIN"],
  users: ["ADMIN", "SUPER_ADMIN"],
};

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessRoute(userRole: UserRole, routeKey: string): boolean {
  const allowedRoles = ROUTE_ACCESS[routeKey];

  if (!allowedRoles) {
    return hasMinimumRole(userRole, "VIEWER");
  }

  return allowedRoles.includes(userRole);
}

export function getRolesAtOrAbove(minimumRole: UserRole): UserRole[] {
  const minimumLevel = ROLE_HIERARCHY[minimumRole];

  return (Object.entries(ROLE_HIERARCHY) as [UserRole, number][])
    .filter(([, level]) => level >= minimumLevel)
    .map(([role]) => role)
    .sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a]);
}

export function isOperationalRole(role: UserRole): boolean {
  return ["STAFF", "SUPERVISOR"].includes(role);
}

export function isManagementRole(role: UserRole): boolean {
  return hasMinimumRole(role, "MANAGER");
}
