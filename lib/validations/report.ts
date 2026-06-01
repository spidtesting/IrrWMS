import { z } from "zod";
import { ReportType } from "@prisma/client";
import { cuidSchema, paginationSchema } from "@/lib/validations/common";

export const generateReportSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    type: z.nativeEnum(ReportType),
    warehouseId: cuidSchema,
    titleEn: z.string().min(3).max(255),
    titleSi: z.string().min(3).max(255),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "fromDate must be before or equal to toDate",
    path: ["toDate"],
  });

export const reportQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  type: z.nativeEnum(ReportType).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  generatedById: cuidSchema.optional(),
});

export const paretoReportParamsSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    warehouseId: cuidSchema,
    topN: z.coerce.number().int().positive().max(100).default(20),
    metric: z.enum(["value", "quantity", "frequency"]).default("value"),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "fromDate must be before or equal to toDate",
    path: ["toDate"],
  });

export const kpiReportParamsSchema = z.object({
  warehouseId: cuidSchema,
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type ParetoReportParams = z.infer<typeof paretoReportParamsSchema>;
