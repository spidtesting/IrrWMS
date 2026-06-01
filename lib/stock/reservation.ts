import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/error-handler";

export type ReserveStockInput = {
  itemId: string;
  warehouseId: string;
  quantity: number;
};

export type ReleaseReservationInput = ReserveStockInput;

export type FulfillReservationInput = ReserveStockInput;

async function getInventoryRecord(itemId: string, warehouseId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: {
      itemId_warehouseId: { itemId, warehouseId },
    },
  });

  if (!inventory) {
    throw new NotFoundError("Inventory record not found");
  }

  return inventory;
}

async function updateWithOptimisticLock(
  tx: Prisma.TransactionClient,
  inventoryId: string,
  version: number,
  data: Prisma.InventoryUpdateInput,
): Promise<void> {
  const result = await tx.inventory.updateMany({
    where: { id: inventoryId, version },
    data: {
      ...data,
      version: { increment: 1 },
    },
  });

  if (result.count === 0) {
    throw new ConflictError("Inventory was modified concurrently. Please retry.");
  }
}

export async function reserveStock(input: ReserveStockInput): Promise<void> {
  if (input.quantity <= 0) {
    throw new ValidationError("Reservation quantity must be positive");
  }

  await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: input.itemId,
          warehouseId: input.warehouseId,
        },
      },
    });

    if (!inventory) throw new NotFoundError("Inventory record not found");

    if (inventory.availableStock < input.quantity) {
      throw new ValidationError("Insufficient available stock to reserve");
    }

    await updateWithOptimisticLock(tx, inventory.id, inventory.version, {
      reservedStock: inventory.reservedStock + input.quantity,
      availableStock: inventory.availableStock - input.quantity,
    });
  });
}

export async function releaseReservation(input: ReleaseReservationInput): Promise<void> {
  if (input.quantity <= 0) {
    throw new ValidationError("Release quantity must be positive");
  }

  await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: input.itemId,
          warehouseId: input.warehouseId,
        },
      },
    });

    if (!inventory) throw new NotFoundError("Inventory record not found");

    if (inventory.reservedStock < input.quantity) {
      throw new ValidationError("Cannot release more than reserved stock");
    }

    await updateWithOptimisticLock(tx, inventory.id, inventory.version, {
      reservedStock: inventory.reservedStock - input.quantity,
      availableStock: inventory.availableStock + input.quantity,
    });
  });
}

export async function fulfillReservation(input: FulfillReservationInput): Promise<void> {
  if (input.quantity <= 0) {
    throw new ValidationError("Fulfillment quantity must be positive");
  }

  await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: input.itemId,
          warehouseId: input.warehouseId,
        },
      },
    });

    if (!inventory) throw new NotFoundError("Inventory record not found");

    if (inventory.reservedStock < input.quantity) {
      throw new ValidationError("Cannot fulfill more than reserved stock");
    }

    const newCurrent = inventory.currentStock - input.quantity;
    if (newCurrent < 0) {
      throw new ValidationError("Insufficient stock to fulfill reservation");
    }

    await updateWithOptimisticLock(tx, inventory.id, inventory.version, {
      currentStock: newCurrent,
      reservedStock: inventory.reservedStock - input.quantity,
    });
  });
}

export async function getAvailableStock(itemId: string, warehouseId: string): Promise<number> {
  const inventory = await getInventoryRecord(itemId, warehouseId);
  return inventory.availableStock;
}

export async function bulkReserveStock(lines: ReserveStockInput[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      const inventory = await tx.inventory.findUnique({
        where: {
          itemId_warehouseId: {
            itemId: line.itemId,
            warehouseId: line.warehouseId,
          },
        },
      });

      if (!inventory) {
        throw new NotFoundError(`Inventory not found for item ${line.itemId}`);
      }

      if (inventory.availableStock < line.quantity) {
        throw new ValidationError(`Insufficient stock for item ${line.itemId}`);
      }

      await updateWithOptimisticLock(tx, inventory.id, inventory.version, {
        reservedStock: inventory.reservedStock + line.quantity,
        availableStock: inventory.availableStock - line.quantity,
      });
    }
  });
}
