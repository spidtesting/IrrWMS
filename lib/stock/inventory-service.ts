import { EntryStatus, Prisma, TransactionType, TransferStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/error-handler";
import type { ApproveStockEntryInput, RejectStockEntryInput } from "@/lib/validations/stock-entry";
import type { InventoryTransferInput } from "@/lib/validations/inventory";

type AuditContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

async function writeStockAuditLog(
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    action: string;
    module: string;
    details: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
  },
): Promise<void> {
  try {
    await tx.auditLog.create({
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
    logger.error({ err: error }, "Failed to write stock audit log");
  }
}

function isOutbound(type: TransactionType): boolean {
  return (
    type === TransactionType.GOODS_ISSUED ||
    type === TransactionType.TRANSFER_OUT ||
    type === TransactionType.DAMAGED ||
    type === TransactionType.EXPIRED
  );
}

async function applyInventoryDelta(
  tx: Prisma.TransactionClient,
  params: {
    itemId: string;
    warehouseId: string;
    delta: number;
  },
): Promise<void> {
  const inventory = await tx.inventory.findUnique({
    where: {
      itemId_warehouseId: {
        itemId: params.itemId,
        warehouseId: params.warehouseId,
      },
    },
  });

  if (!inventory) {
    throw new NotFoundError("Inventory record not found");
  }

  const newCurrent = inventory.currentStock + params.delta;
  if (newCurrent < 0) {
    throw new ValidationError("Insufficient stock for this operation");
  }

  const newAvailable = newCurrent - inventory.reservedStock;
  if (newAvailable < 0) {
    throw new ConflictError("Cannot reduce stock below reserved quantity");
  }

  const updated = await tx.inventory.updateMany({
    where: {
      id: inventory.id,
      version: inventory.version,
    },
    data: {
      currentStock: newCurrent,
      availableStock: newAvailable,
      version: { increment: 1 },
    },
  });

  if (updated.count === 0) {
    throw new ConflictError("Inventory was modified concurrently. Please retry.");
  }
}

export async function approveStockEntry(
  input: ApproveStockEntryInput,
  approverId: string,
  audit?: AuditContext,
) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.stockEntry.findUnique({
      where: { id: input.stockEntryId },
      include: { item: true },
    });

    if (!entry) throw new NotFoundError("Stock entry not found");
    if (entry.status !== EntryStatus.PENDING) {
      throw new ConflictError(`Entry is already ${entry.status.toLowerCase()}`);
    }

    const delta = isOutbound(entry.type) ? -entry.quantity : entry.quantity;
    await applyInventoryDelta(tx, {
      itemId: entry.itemId,
      warehouseId: entry.warehouseId,
      delta,
    });

    const approved = await tx.stockEntry.update({
      where: { id: entry.id },
      data: {
        status: EntryStatus.APPROVED,
        approvedById: approverId,
        approvedAt: new Date(),
        remarks: input.remarks ?? entry.remarks,
      },
    });

    await writeStockAuditLog(tx, {
      userId: approverId,
      action: "APPROVE",
      module: "StockEntry",
      details: {
        entityId: entry.id,
        warehouseId: entry.warehouseId,
        entryNumber: entry.entryNumber,
        type: entry.type,
      },
      ipAddress: audit?.ipAddress,
      userAgent: audit?.userAgent,
    });

    return approved;
  });
}

export async function rejectStockEntry(
  input: RejectStockEntryInput,
  approverId: string,
  audit?: AuditContext,
) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.stockEntry.findUnique({
      where: { id: input.stockEntryId },
    });

    if (!entry) throw new NotFoundError("Stock entry not found");
    if (entry.status !== EntryStatus.PENDING) {
      throw new ConflictError(`Entry is already ${entry.status.toLowerCase()}`);
    }

    const rejected = await tx.stockEntry.update({
      where: { id: entry.id },
      data: {
        status: EntryStatus.REJECTED,
        approvedById: approverId,
        approvedAt: new Date(),
        remarks: input.reason,
      },
    });

    await writeStockAuditLog(tx, {
      userId: approverId,
      action: "REJECT",
      module: "StockEntry",
      details: {
        entityId: entry.id,
        warehouseId: entry.warehouseId,
        reason: input.reason,
      },
      ipAddress: audit?.ipAddress,
      userAgent: audit?.userAgent,
    });

    return rejected;
  });
}

export async function executeStockTransfer(
  input: InventoryTransferInput,
  requestedById: string,
  audit?: AuditContext,
) {
  if (input.fromWarehouseId === input.toWarehouseId) {
    throw new ValidationError("Source and destination warehouses must differ");
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findFirst({
      where: {
        id: input.itemId,
        warehouseId: input.fromWarehouseId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!item) throw new NotFoundError("Item not found in source warehouse");

    const sourceInventory = await tx.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: input.itemId,
          warehouseId: input.fromWarehouseId,
        },
      },
    });

    if (!sourceInventory || sourceInventory.availableStock < input.quantity) {
      throw new ValidationError("Insufficient available stock to transfer");
    }

    const transferNo = `TRF-${Date.now()}`;

    const transfer = await tx.stockTransfer.create({
      data: {
        transferNo,
        fromWarehouseId: input.fromWarehouseId,
        toWarehouseId: input.toWarehouseId,
        status: TransferStatus.RECEIVED,
        requestedById,
        approvedById: requestedById,
        approvedAt: new Date(),
        shippedAt: new Date(),
        receivedAt: new Date(),
        remarks: input.remarks,
        lines: {
          create: {
            itemId: input.itemId,
            quantity: input.quantity,
            fromBinId: input.fromBinId ?? undefined,
            toBinId: input.toBinId ?? undefined,
          },
        },
      },
    });

    await applyInventoryDelta(tx, {
      itemId: input.itemId,
      warehouseId: input.fromWarehouseId,
      delta: -input.quantity,
    });

    const destInventory = await tx.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: input.itemId,
          warehouseId: input.toWarehouseId,
        },
      },
    });

    if (destInventory) {
      await applyInventoryDelta(tx, {
        itemId: input.itemId,
        warehouseId: input.toWarehouseId,
        delta: input.quantity,
      });
    } else {
      await tx.inventory.create({
        data: {
          itemId: input.itemId,
          warehouseId: input.toWarehouseId,
          currentStock: input.quantity,
          reservedStock: 0,
          availableStock: input.quantity,
          binLocationId: input.toBinId ?? undefined,
        },
      });
    }

    await tx.stockEntry.createMany({
      data: [
        {
          entryNumber: `${transferNo}-OUT`,
          type: TransactionType.TRANSFER_OUT,
          itemId: input.itemId,
          warehouseId: input.fromWarehouseId,
          quantity: input.quantity,
          referenceNo: transferNo,
          remarks: input.remarks,
          createdById: requestedById,
          approvedById: requestedById,
          approvedAt: new Date(),
          status: EntryStatus.APPROVED,
        },
        {
          entryNumber: `${transferNo}-IN`,
          type: TransactionType.TRANSFER_IN,
          itemId: input.itemId,
          warehouseId: input.toWarehouseId,
          quantity: input.quantity,
          referenceNo: transferNo,
          remarks: input.remarks,
          createdById: requestedById,
          approvedById: requestedById,
          approvedAt: new Date(),
          status: EntryStatus.APPROVED,
        },
      ],
    });

    await writeStockAuditLog(tx, {
      userId: requestedById,
      action: "CREATE",
      module: "StockTransfer",
      details: {
        entityId: transfer.id,
        warehouseId: input.fromWarehouseId,
        transferNo,
        quantity: input.quantity,
      },
      ipAddress: audit?.ipAddress,
      userAgent: audit?.userAgent,
    });

    return transfer;
  });
}
