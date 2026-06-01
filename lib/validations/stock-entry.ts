import { z } from "zod";
import { EntryMethod, EntryStatus, TransactionType } from "@prisma/client";
import { cuidSchema, decimalSchema, paginationSchema } from "@/lib/validations/common";

export const createStockEntrySchema = z.object({
  type: z.nativeEnum(TransactionType),
  itemId: cuidSchema,
  warehouseId: cuidSchema,
  quantity: z.number().positive(),
  unitPrice: decimalSchema.optional(),
  referenceNo: z.string().max(50).optional(),
  remarks: z.string().max(500).optional(),
  entryMethod: z.nativeEnum(EntryMethod).default(EntryMethod.MANUAL),
  grnId: cuidSchema.optional(),
  ginId: cuidSchema.optional(),
  idempotencyKey: z.string().min(8).max(64).optional(),
});

export const approveStockEntrySchema = z.object({
  stockEntryId: cuidSchema,
  remarks: z.string().max(500).optional(),
});

export const rejectStockEntrySchema = z.object({
  stockEntryId: cuidSchema,
  reason: z.string().min(3).max(500),
});

export const stockEntryQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  itemId: cuidSchema.optional(),
  type: z.nativeEnum(TransactionType).optional(),
  status: z.nativeEnum(EntryStatus).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  createdById: cuidSchema.optional(),
});

export type CreateStockEntryInput = z.infer<typeof createStockEntrySchema>;
export type ApproveStockEntryInput = z.infer<typeof approveStockEntrySchema>;
export type RejectStockEntryInput = z.infer<typeof rejectStockEntrySchema>;
