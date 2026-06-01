import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/error-handler";
import { logger } from "@/lib/logger";
import type { SessionUser } from "@/types/auth";

export { getRequestAuditContext } from "@/lib/audit";

export async function writeModuleAudit(input: {
  userId: string;
  action: string;
  module: string;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        module: input.module,
        details: input.details as Prisma.InputJsonValue,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to write audit log");
  }
}

export function generateDocumentNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const unique = Date.now().toString(36).toUpperCase();
  return `${prefix}-${year}-${unique}`;
}

export function resolveWarehouseFilter(
  user: SessionUser,
  warehouseId?: string | null,
): string | undefined {
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
    return warehouseId ?? undefined;
  }

  if (warehouseId && warehouseId !== user.warehouseId) {
    throw new ForbiddenError("You do not have access to this warehouse");
  }

  return user.warehouseId ?? undefined;
}

export function objectFromSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export const inventoryInclude = {
  item: {
    include: {
      category: true,
      supplier: true,
    },
  },
  warehouse: true,
  binLocation: true,
  lotBatch: true,
} satisfies Prisma.InventoryInclude;

export const stockEntryInclude = {
  item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true, unit: true } },
  warehouse: { select: { id: true, code: true, nameEn: true } },
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
} satisfies Prisma.StockEntryInclude;
