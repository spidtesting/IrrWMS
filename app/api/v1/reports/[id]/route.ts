import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { resolveWarehouseFilter } from "@/lib/api/helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("reports");
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        warehouse: true,
        generatedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
      },
    });

    if (!report) throw new NotFoundError("Report not found");

    resolveWarehouseFilter(user, report.warehouseId);

    return successResponse(report);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("reports");
    const { id } = await params;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundError("Report not found");

    resolveWarehouseFilter(user, report.warehouseId);

    await prisma.report.delete({ where: { id } });

    return successResponse({ id }, { message: "Report deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
