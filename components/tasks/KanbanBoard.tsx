"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { TaskRecord } from "@/types/entities";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

const COLUMNS = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export type KanbanBoardProps = {
  tasks: TaskRecord[];
  onStatusChange: (taskId: string, status: string) => void;
};

export function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
  const t = useTranslations("tasks");
  const [activeTask, setActiveTask] = useState<TaskRecord | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as string;
    const task = tasks.find((t) => t.id === active.id);
    if (
      task &&
      task.status !== newStatus &&
      COLUMNS.includes(newStatus as (typeof COLUMNS)[number])
    ) {
      onStatusChange(task.id, newStatus);
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={t(status.toLowerCase() as "pending")}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}
