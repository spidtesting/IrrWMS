import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  try {
    const user = await requireAuth();

    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return successResponse({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
