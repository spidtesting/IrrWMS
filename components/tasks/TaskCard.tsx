"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { formatDate } from "@/lib/utils/formatters";
import type { TaskRecord } from "@/types/entities";

export type TaskCardProps = {
  task: TaskRecord;
  isDragging?: boolean;
};

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm",
        (isDragging || isSortableDragging) && "opacity-50 shadow-lg",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <BilingualLabel en={task.titleEn} si={task.titleSi} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={task.priority} />
            <StatusBadge status={task.taskType} />
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {task.assignedTo.fullNameEn}
          </p>
        </div>
      </div>
    </div>
  );
}
