import { z } from "zod";
import { GINStatus } from "@prisma/client";
import {
  cuidSchema,
  optionalCuidSchema,
  paginationSchema,
  positiveQuantitySchema,
} from "@/lib/validations/common";

export const ginLineSchema = z.object({
  itemId: cuidSchema,
  requestedQty: z.number().min(0).default(0),
  issuedQty: positiveQuantitySchema,
  binLocationId: optionalCuidSchema,
});

export const createGINSchema = z.object({
  requisitionId: optionalCuidSchema,
  issuedToId: cuidSchema,
  warehouseId: cuidSchema,
  issueDate: z.coerce.date().optional(),
  remarks: z.string().max(500).optional(),
  lines: z.array(ginLineSchema).min(1, "At least one line item is required"),
});

export const updateGINSchema = createGINSchema.partial().extend({
  id: cuidSchema,
});

export const updateGINStatusSchema = z.object({
  id: cuidSchema,
  status: z.nativeEnum(GINStatus),
  remarks: z.string().max(500).optional(),
});

export const approveGINSchema = z.object({
  id: cuidSchema,
  remarks: z.string().max(500).optional(),
});

export const ginQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  issuedToId: cuidSchema.optional(),
  status: z.nativeEnum(GINStatus).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GINLineInput = z.infer<typeof ginLineSchema>;
export type CreateGINInput = z.infer<typeof createGINSchema>;
