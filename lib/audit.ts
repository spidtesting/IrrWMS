import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type { Prisma } from "@prisma/client";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "IMPORT"
  | "ASSIGN"
  | "COMPLETE"
  | "CANCEL"
  | "APPROVE"
  | "REJECT";

export type WriteAuditLogInput = {
  userId: string;
  action: AuditAction;
  module: string;
  details?: Record<string, unknown>;
  correlationId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  beforeSnapshot?: Record<string, unknown> | null;
  afterSnapshot?: Record<string, unknown> | null;
};

/** @deprecated Use module/details fields directly */
export type LegacyAuditInput = {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  warehouseId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function writeAuditLog(input: WriteAuditLogInput | LegacyAuditInput): Promise<void> {
  try {
    const isLegacy = "entityType" in input;

    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        module: isLegacy ? input.entityType : input.module,
        details: (isLegacy
          ? {
              entityId: input.entityId,
              warehouseId: input.warehouseId ?? null,
              ...(input.metadata ?? {}),
            }
          : (input.details ?? {})) as Prisma.InputJsonValue,
        correlationId: isLegacy ? null : (input.correlationId ?? null),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        beforeSnapshot: isLegacy
          ? undefined
          : ((input.beforeSnapshot ?? undefined) as Prisma.InputJsonValue | undefined),
        afterSnapshot: isLegacy
          ? undefined
          : ((input.afterSnapshot ?? undefined) as Prisma.InputJsonValue | undefined),
      },
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        userId: input.userId,
        action: input.action,
      },
      "Failed to write audit log",
    );
  }
}

export function getRequestAuditContext(request: Request): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;

  return {
    ipAddress,
    userAgent: request.headers.get("user-agent"),
  };
}
