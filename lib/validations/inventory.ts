import { z } from "zod";
import {
  cuidSchema,
  nonNegativeQuantitySchema,
  optionalCuidSchema,
  paginationSchema,
} from "@/lib/validations/common";

export const inventoryQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  categoryId: cuidSchema.optional(),
  search: z.string().trim().max(100).optional(),
  lowStockOnly: z.coerce.boolean().optional(),
  binLocationId: cuidSchema.optional(),
});

export const inventoryAdjustSchema = z.object({
  itemId: cuidSchema,
  warehouseId: cuidSchema,
  quantity: z.number().refine((val) => val !== 0, {
    message: "Adjustment quantity cannot be zero",
  }),
  reason: z.string().min(3).max(500),
  binLocationId: optionalCuidSchema,
  idempotencyKey: z.string().min(8).max(64).optional(),
});

export const inventoryTransferSchema = z.object({
  itemId: cuidSchema,
  fromWarehouseId: cuidSchema,
  toWarehouseId: cuidSchema,
  quantity: z.number().positive(),
  fromBinId: optionalCuidSchema,
  toBinId: optionalCuidSchema,
  remarks: z.string().max(500).optional(),
});

export const updateInventoryBinSchema = z.object({
  inventoryId: cuidSchema,
  binLocationId: optionalCuidSchema,
});

export const inventorySnapshotSchema = z.object({
  itemId: cuidSchema,
  warehouseId: cuidSchema,
  currentStock: nonNegativeQuantitySchema,
  reservedStock: nonNegativeQuantitySchema,
  availableStock: nonNegativeQuantitySchema,
});

export type InventoryQueryInput = z.infer<typeof inventoryQuerySchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;
export type InventoryTransferInput = z.infer<typeof inventoryTransferSchema>;
