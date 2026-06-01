import { auth } from "@/auth";
import { AuthError, ForbiddenError, assertCondition } from "@/lib/error-handler";
import { canAccessRoute, hasMinimumRole } from "@/lib/constants/roles";
import type { SessionUser, UserRole } from "@/types/auth";

function normalizeSessionUser(user: Record<string, unknown>): SessionUser {
  return {
    id: String(user.id ?? user.sub ?? ""),
    email: String(user.email ?? ""),
    name: (user.name as string | null | undefined) ?? null,
    image: (user.image as string | null | undefined) ?? null,
    role: (user.role as UserRole | undefined) ?? "VIEWER",
    warehouseId: (user.warehouseId as string | null | undefined) ?? null,
    fullNameEn: String(user.fullNameEn ?? user.name ?? ""),
    fullNameSi: String(user.fullNameSi ?? ""),
    employeeId: String(user.employeeId ?? ""),
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return normalizeSessionUser(session.user as unknown as Record<string, unknown>);
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  assertCondition(user, new AuthError("Authentication required"));
  return user;
}

export async function requireRole(allowedRoles: UserRole | UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const hasRole = roles.some((role) => user.role === role || hasMinimumRole(user.role, role));

  assertCondition(hasRole, new ForbiddenError("Insufficient permissions for this action"));

  return user;
}

export async function requireRouteAccess(routeKey: string): Promise<SessionUser> {
  const user = await requireAuth();

  assertCondition(
    canAccessRoute(user.role, routeKey),
    new ForbiddenError("You do not have access to this resource"),
  );

  return user;
}

export async function requireWarehouse(
  warehouseId?: string | null,
): Promise<{ user: SessionUser; warehouseId: string }> {
  const user = await requireAuth();
  const resolvedWarehouseId = warehouseId ?? user.warehouseId;

  assertCondition(resolvedWarehouseId, new ForbiddenError("Warehouse context is required"));

  const hasWarehouseAccess =
    user.role === "SUPER_ADMIN" ||
    user.role === "ADMIN" ||
    user.warehouseId === resolvedWarehouseId;

  assertCondition(
    hasWarehouseAccess,
    new ForbiddenError("You do not have access to this warehouse"),
  );

  return { user, warehouseId: resolvedWarehouseId };
}

export async function requirePermission(permission: string): Promise<SessionUser> {
  const user = await requireAuth();

  assertCondition(
    user.role === "SUPER_ADMIN" || user.role === "ADMIN",
    new ForbiddenError(`Missing required permission: ${permission}`),
  );

  return user;
}
