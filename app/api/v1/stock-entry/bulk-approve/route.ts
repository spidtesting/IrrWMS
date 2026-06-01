import { NextRequest } from "next/server";
import { z } from "zod";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { approveStockEntry } from "@/lib/stock/inventory-service";
import { getRequestAuditContext } from "@/lib/api/helpers";
import { cuidSchema } from "@/lib/validations/common";

const bulkApproveSchema = z.object({
  stockEntryIds: z.array(cuidSchema).min(1).max(50),
  remarks: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const body = bulkApproveSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const results = [];
    const errors: Array<{ id: string; message: string }> = [];

    for (const stockEntryId of body.stockEntryIds) {
      try {
        const approved = await approveStockEntry(
          { stockEntryId, remarks: body.remarks },
          user.id,
          audit,
        );
        results.push(approved);
      } catch (error) {
        errors.push({
          id: stockEntryId,
          message: error instanceof Error ? error.message : "Approval failed",
        });
      }
    }

    return successResponse(
      { approved: results, errors },
      {
        message: `${results.length} approved, ${errors.length} failed`,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
