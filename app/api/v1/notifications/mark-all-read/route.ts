import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(_request: NextRequest) {
  try {
    const user = await requireAuth();

    const result = await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return successResponse(
      { updatedCount: result.count },
      { message: `${result.count} notification(s) marked as read` },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request);
}
