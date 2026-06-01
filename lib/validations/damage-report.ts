import { z } from "zod";
import { DamageStatus } from "@prisma/client";
import {
  cuidSchema,
  decimalSchema,
  paginationSchema,
  positiveQuantitySchema,
} from "@/lib/validations/common";

export const damageReportLineSchema = z.object({
  itemId: cuidSchema,
  quantity: positiveQuantitySchema,
  reason: z.string().min(3).max(500),
  costImpact: decimalSchema,
  images: z.array(z.string().url()).optional(),
});

export const createDamageReportSchema = z.object({
  warehouseId: cuidSchema,
  incidentDate: z.coerce.date().optional(),
  remarks: z.string().max(500).optional(),
  lines: z.array(damageReportLineSchema).min(1, "At least one damage line is required"),
});

export const updateDamageReportSchema = createDamageReportSchema.partial().extend({
  id: cuidSchema,
});

export const updateDamageStatusSchema = z.object({
  id: cuidSchema,
  status: z.nativeEnum(DamageStatus),
  remarks: z.string().max(500).optional(),
});

export const approveDamageReportSchema = z.object({
  id: cuidSchema,
  remarks: z.string().max(500).optional(),
});

export const damageReportQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  status: z.nativeEnum(DamageStatus).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type DamageReportLineInput = z.infer<typeof damageReportLineSchema>;
export type CreateDamageReportInput = z.infer<typeof createDamageReportSchema>;
