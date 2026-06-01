import { z } from "zod";
import { Priority, TaskStatus, TaskType } from "@prisma/client";
import { cuidSchema, paginationSchema } from "@/lib/validations/common";

export const createTaskSchema = z.object({
  titleEn: z.string().min(3).max(255),
  titleSi: z.string().min(3).max(255),
  assignedToId: cuidSchema,
  taskType: z.nativeEnum(TaskType),
  dueDate: z.coerce.date(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  notes: z.string().max(1000).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: cuidSchema,
  status: z.nativeEnum(TaskStatus).optional(),
  completedAt: z.coerce.date().optional().nullable(),
});

export const completeTaskSchema = z.object({
  id: cuidSchema,
  notes: z.string().max(1000).optional(),
});

export const taskQuerySchema = paginationSchema.extend({
  assignedToId: cuidSchema.optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  taskType: z.nativeEnum(TaskType).optional(),
  priority: z.nativeEnum(Priority).optional(),
  overdueOnly: z.coerce.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
