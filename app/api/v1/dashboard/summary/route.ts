import { NextRequest } from "next/server";
import { z } from "zod";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireWarehouse } from "@/lib/auth-guard";
import { getDashboardSummary } from "@/lib/dashboard/get-summary";

const querySchema = z.object({
  warehouseId: z.string().cuid().optional(),
  period: z.enum(["7d", "30d", "90d"]).default("30d"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      warehouseId: searchParams.get("warehouseId") ?? undefined,
      period: searchParams.get("period") ?? "30d",
    });

    const { warehouseId } = await requireWarehouse(parsed.warehouseId);
    const summary = await getDashboardSummary(warehouseId, parsed.period);

    return successResponse(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
