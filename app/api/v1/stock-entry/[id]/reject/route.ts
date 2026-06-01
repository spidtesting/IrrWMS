import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { rejectStockEntry } from "@/lib/stock/inventory-service";
import { getRequestAuditContext } from "@/lib/api/helpers";
import { rejectStockEntrySchema } from "@/lib/validations/stock-entry";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const audit = getRequestAuditContext(request);
    const body = rejectStockEntrySchema.parse({
      ...(await request.json()),
      stockEntryId: id,
    });

    const rejected = await rejectStockEntry(body, user.id, audit);

    return successResponse(rejected, { message: "Stock entry rejected" });
  } catch (error) {
    return handleApiError(error);
  }
}
