import { z } from "zod";
import { cuidSchema } from "@/lib/validations/common";

export const inventoryImportQuerySchema = z.object({
  warehouseId: cuidSchema.optional(),
});
