import { z } from "zod";
import { cuidSchema, paginationSchema } from "@/lib/validations/common";

export const createSupplierSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase alphanumeric with hyphens"),
  nameEn: z.string().min(2).max(255),
  nameSi: z.string().min(2).max(255),
  contact: z.string().min(5).max(50),
  email: z.string().email().optional().nullable(),
  address: z.string().min(5).max(500),
  isActive: z.boolean().default(true),
});

export const updateSupplierSchema = createSupplierSchema.partial().extend({
  id: cuidSchema,
});

export const supplierQuerySchema = paginationSchema.extend({
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().max(100).optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
