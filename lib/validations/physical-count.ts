import { z } from "zod";
import { CountStatus } from "@prisma/client";
import {
  cuidSchema,
  optionalCuidSchema,
  paginationSchema,
  nonNegativeQuantitySchema,
} from "@/lib/validations/common";

export const physicalCountLineSchema = z.object({
  itemId: cuidSchema,
  binLocationId: optionalCuidSchema,
  expectedQty: nonNegativeQuantitySchema,
  countedQty: nonNegativeQuantitySchema.optional(),
  isBlind: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

export const createPhysicalCountSchema = z.object({
  warehouseId: cuidSchema,
  conductedById: cuidSchema,
  remarks: z.string().max(500).optional(),
  lines: z.array(physicalCountLineSchema).min(1, "At least one count line is required"),
});

export const updateCountLineSchema = z.object({
  lineId: cuidSchema,
  countedQty: nonNegativeQuantitySchema,
  recountedQty: nonNegativeQuantitySchema.optional(),
  notes: z.string().max(500).optional(),
});

export const updateCountStatusSchema = z.object({
  id: cuidSchema,
  status: z.nativeEnum(CountStatus),
  remarks: z.string().max(500).optional(),
});

export const approvePhysicalCountSchema = z.object({
  id: cuidSchema,
  remarks: z.string().max(500).optional(),
});

export const physicalCountQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  status: z.nativeEnum(CountStatus).optional(),
  conductedById: cuidSchema.optional(),
});

export type PhysicalCountLineInput = z.infer<typeof physicalCountLineSchema>;
export type CreatePhysicalCountInput = z.infer<typeof createPhysicalCountSchema>;
