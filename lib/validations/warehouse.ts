import { z } from "zod";
import { cuidSchema, paginationSchema } from "@/lib/validations/common";

export const createWarehouseSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase alphanumeric with hyphens"),
  nameEn: z.string().min(2).max(255),
  nameSi: z.string().min(2).max(255),
  location: z.string().min(2).max(500),
  district: z.string().min(2).max(100),
  capacity: z.number().positive(),
  isActive: z.boolean().default(true),
});

export const updateWarehouseSchema = createWarehouseSchema.partial().extend({
  id: cuidSchema,
});

export const createZoneSchema = z.object({
  warehouseId: cuidSchema,
  code: z.string().min(1).max(20),
  nameEn: z.string().min(2).max(255),
  nameSi: z.string().min(2).max(255),
});

export const updateZoneSchema = createZoneSchema.partial().extend({
  id: cuidSchema,
});

export const createBinLocationSchema = z.object({
  warehouseId: cuidSchema,
  zoneId: cuidSchema,
  code: z.string().min(1).max(30),
  aisle: z.string().max(10).optional(),
  shelf: z.string().max(10).optional(),
  isActive: z.boolean().default(true),
});

export const updateBinLocationSchema = createBinLocationSchema.partial().extend({
  id: cuidSchema,
});

export const warehouseQuerySchema = paginationSchema.extend({
  district: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().max(100).optional(),
});

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type CreateZoneInput = z.infer<typeof createZoneSchema>;
export type CreateBinLocationInput = z.infer<typeof createBinLocationSchema>;
