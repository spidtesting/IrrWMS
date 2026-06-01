import { NextRequest } from "next/server";
import { Prisma, NotifType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { paginatedResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import { objectFromSearchParams } from "@/lib/api/helpers";
import { paginationSchema } from "@/lib/validations/common";

const notificationQuerySchema = paginationSchema.extend({
  isRead: z.coerce.boolean().optional(),
  type: z.nativeEnum(NotifType).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = request.nextUrl;
    const query = notificationQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);

    const where: Prisma.NotificationWhereInput = {
      userId: user.id,
      ...(query.isRead !== undefined ? { isRead: query.isRead } : {}),
      ...(query.type ? { type: query.type } : {}),
    };

    const [total, data, unreadCount] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(total, pagination), {
      message: unreadCount > 0 ? `${unreadCount} unread notification(s)` : undefined,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
