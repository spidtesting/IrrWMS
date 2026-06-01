import { z } from "zod";

export const cuidSchema = z.string().cuid();
export const optionalCuidSchema = z.string().cuid().optional().nullable();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const bilingualTextSchema = z.object({
  nameEn: z.string().min(1).max(255),
  nameSi: z.string().min(1).max(255),
});

export const decimalSchema = z
  .union([z.number(), z.string()])
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .refine((val) => Number.isFinite(val) && val >= 0, {
    message: "Must be a non-negative number",
  });

export const positiveQuantitySchema = z.number().positive("Quantity must be greater than zero");

export const nonNegativeQuantitySchema = z.number().min(0);

export const dateRangeSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "fromDate must be before or equal to toDate",
    path: ["toDate"],
  });
