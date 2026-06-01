import { z } from "zod";
import { GRNStatus } from "@prisma/client";
import {
  cuidSchema,
  decimalSchema,
  optionalCuidSchema,
  paginationSchema,
  positiveQuantitySchema,
} from "@/lib/validations/common";

export const grnLineSchema = z.object({
  itemId: cuidSchema,
  orderedQty: z.number().min(0).default(0),
  receivedQty: positiveQuantitySchema,
  unitPrice: decimalSchema,
  lotBatchId: optionalCuidSchema,
});

export const createGRNSchema = z.object({
  supplierId: cuidSchema,
  warehouseId: cuidSchema,
  poId: optionalCuidSchema,
  receivedDate: z.coerce.date().optional(),
  remarks: z.string().max(500).optional(),
  lines: z.array(grnLineSchema).min(1, "At least one line item is required"),
});

export const updateGRNSchema = createGRNSchema.partial().extend({
  id: cuidSchema,
});

export const updateGRNStatusSchema = z.object({
  id: cuidSchema,
  status: z.nativeEnum(GRNStatus),
  remarks: z.string().max(500).optional(),
});

export const approveGRNSchema = z.object({
  id: cuidSchema,
  remarks: z.string().max(500).optional(),
});

export const grnQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  supplierId: cuidSchema.optional(),
  status: z.nativeEnum(GRNStatus).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GRNLineInput = z.infer<typeof grnLineSchema>;
export type CreateGRNInput = z.infer<typeof createGRNSchema>;
