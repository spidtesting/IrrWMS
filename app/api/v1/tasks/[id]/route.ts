import { NextRequest } from "next/server";
import { TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ForbiddenError, NotFoundError } from "@/lib/error-handler";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { getRequestAuditContext, writeModuleAudit } from "@/lib/api/helpers";
import { completeTaskSchema, updateTaskSchema } from "@/lib/validations/task";

type RouteParams = { params: Promise<{ id: string }> };

const taskInclude = {
  assignedTo: { select: { id: true, fullNameEn: true, employeeId: true } },
};

function canAccessTask(userId: string, userRole: string, assignedToId: string): boolean {
  if (["SUPER_ADMIN", "ADMIN", "MANAGER", "SUPERVISOR"].includes(userRole)) {
    return true;
  }
  return userId === assignedToId;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });

    if (!task) throw new NotFoundError("Task not found");

    if (!canAccessTask(user.id, user.role, task.assignedToId)) {
      throw new ForbiddenError("You do not have access to this task");
    }

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const raw = await request.json();
    const audit = getRequestAuditContext(request);

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Task not found");

    if (!canAccessTask(user.id, user.role, existing.assignedToId)) {
      throw new ForbiddenError("You do not have access to this task");
    }

    if (raw.action === "complete") {
      const complete = completeTaskSchema.parse({ id, ...raw });

      const updated = await prisma.task.update({
        where: { id },
        data: {
          status: TaskStatus.COMPLETED,
          completedAt: new Date(),
          notes: complete.notes ?? existing.notes,
        },
        include: taskInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: "COMPLETE",
        module: "Task",
        details: { entityId: id },
        ...audit,
      });

      return successResponse(updated, { message: "Task completed" });
    }

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER", "SUPERVISOR"].includes(user.role)) {
      throw new ForbiddenError("Only supervisors can update task details");
    }

    const body = updateTaskSchema.parse({ id, ...raw });
    const { id: _id, ...data } = body;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(data.status === TaskStatus.IN_PROGRESS && !existing.completedAt ? {} : {}),
      },
      include: taskInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "Task",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Task updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Task not found");

    const updated = await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.CANCELLED },
      include: taskInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "Task",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Task cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
