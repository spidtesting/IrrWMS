import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ForbiddenError, NotFoundError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) throw new NotFoundError("Notification not found");

    if (notification.userId !== user.id) {
      throw new ForbiddenError("You do not have access to this notification");
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return successResponse(updated, { message: "Notification marked as read" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  return POST(request, context);
}
