"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useTaskList, useUpdateTaskStatus } from "@/hooks/api/use-staff";
import { Button } from "@/components/ui/button";

export default function StaffTasksPage() {
  const t = useTranslations("tasks");
  const { data, isLoading } = useTaskList({ limit: 100 });
  const updateStatus = useUpdateTaskStatus();

  function handleStatusChange(taskId: string, status: string) {
    updateStatus.mutate(
      { id: taskId, status },
      {
        onSuccess: () => toast.success(t("statusUpdated")),
        onError: () => toast.error(t("updateFailed")),
      },
    );
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        breadcrumbs={[{ label: t("staff"), href: "/staff" }, { label: t("title") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/staff">{t("back")}</Link>
          </Button>
        }
      />
      {isLoading ? (
        <LoadingSkeleton rows={4} columns={3} />
      ) : (
        <KanbanBoard tasks={data?.data ?? []} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
