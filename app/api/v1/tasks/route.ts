import { NextRequest } from "next/server";
import { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginatedResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import {
  getRequestAuditContext,
  writeModuleAudit,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { completeTaskSchema, createTaskSchema, taskQuerySchema } from "@/lib/validations/task";

const taskInclude = {
  assignedTo: { select: { id: true, fullNameEn: true, employeeId: true } },
} satisfies Prisma.TaskInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = request.nextUrl;
    const query = taskQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);

    const isManager = ["SUPER_ADMIN", "ADMIN", "MANAGER", "SUPERVISOR"].includes(user.role);

    const where: Prisma.TaskWhereInput = {
      ...(isManager && query.assignedToId
        ? { assignedToId: query.assignedToId }
        : { assignedToId: user.id }),
      ...(query.status ? { status: query.status } : {}),
      ...(query.taskType ? { taskType: query.taskType } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.overdueOnly
        ? {
            dueDate: { lt: new Date() },
            status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.OVERDUE] },
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(total, pagination));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("SUPERVISOR");
    const body = createTaskSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const task = await prisma.task.create({
      data: body,
      include: taskInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "ASSIGN",
      module: "Task",
      details: { entityId: task.id, assignedToId: task.assignedToId },
      ...audit,
    });

    return successResponse(task, { status: 201, message: "Task created" });
  } catch (error) {
    return handleApiError(error);
  }
}
