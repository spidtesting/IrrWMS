import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { executeStockTransfer } from "@/lib/stock/inventory-service";
import { getRequestAuditContext, resolveWarehouseFilter } from "@/lib/api/helpers";
import { inventoryTransferSchema } from "@/lib/validations/inventory";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const body = inventoryTransferSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.fromWarehouseId);

    const transfer = await executeStockTransfer(body, user.id, audit);

    return successResponse(transfer, {
      status: 201,
      message: "Stock transfer completed",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
