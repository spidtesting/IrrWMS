import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { approveStockEntry } from "@/lib/stock/inventory-service";
import { getRequestAuditContext } from "@/lib/api/helpers";
import { approveStockEntrySchema } from "@/lib/validations/stock-entry";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const audit = getRequestAuditContext(request);
    const body = approveStockEntrySchema.parse({
      ...(await request.json()),
      stockEntryId: id,
    });

    const approved = await approveStockEntry(body, user.id, audit);

    return successResponse(approved, { message: "Stock entry approved" });
  } catch (error) {
    return handleApiError(error);
  }
}
