import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { parseItemsWorkbook } from "@/lib/import/parse-items-xlsx";
import { importItemsIntoDatabase } from "@/lib/import/items-excel-import";
import { getRequestAuditContext, writeModuleAudit } from "@/lib/api/helpers";
import { inventoryImportQuerySchema } from "@/lib/validations/inventory-import";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["MANAGER", "ADMIN", "SUPER_ADMIN"]);
    await requireRouteAccess("inventory");

    const { searchParams } = request.nextUrl;
    const query = inventoryImportQuerySchema.parse({
      warehouseId: searchParams.get("warehouseId") ?? undefined,
    });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse("VALIDATION_ERROR", 'Upload an Excel file in form field "file"', {
        status: 422,
      });
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return errorResponse("VALIDATION_ERROR", "Only .xlsx or .xls files are supported", {
        status: 422,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_FILE_BYTES) {
      return errorResponse("VALIDATION_ERROR", "Maximum file size is 5MB", { status: 422 });
    }

    const records = parseItemsWorkbook(buffer);
    if (records.length === 0) {
      return errorResponse("VALIDATION_ERROR", "No valid item rows found in spreadsheet", {
        status: 422,
      });
    }

    const result = await importItemsIntoDatabase(prisma, records, {
      warehouseId: query.warehouseId,
    });

    const audit = getRequestAuditContext(request);
    await writeModuleAudit({
      userId: user.id,
      action: "IMPORT",
      module: "inventory",
      details: {
        fileName: file.name,
        rowCount: records.length,
        ...result,
      },
      ...audit,
    });

    return successResponse(
      {
        fileName: file.name,
        rowCount: records.length,
        ...result,
      },
      { status: 201, message: `Imported ${records.length} items from Excel` },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
