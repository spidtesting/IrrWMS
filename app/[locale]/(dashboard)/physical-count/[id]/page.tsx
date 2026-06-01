"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CountLineTable } from "@/components/physical-count/CountLineTable";
import { VarianceReport } from "@/components/physical-count/VarianceReport";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  usePhysicalCount,
  useCompletePhysicalCount,
  useUpdateCountLines,
} from "@/hooks/api/use-physical-count";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PhysicalCountDetailPage() {
  const t = useTranslations("physicalCount");
  const params = useParams();
  const id = params.id as string;
  const { data: cycle, isLoading } = usePhysicalCount(id);
  const completeCount = useCompletePhysicalCount(id);
  const updateLines = useUpdateCountLines(id);

  if (isLoading) return <LoadingSkeleton rows={6} columns={4} />;
  if (!cycle) return <p>{t("notFound")}</p>;

  const isEditable = cycle.status === "IN_PROGRESS" || cycle.status === "RECOUNT";

  return (
    <div>
      <PageHeader
        title={cycle.cycleNo}
        breadcrumbs={[{ label: t("title"), href: "/physical-count" }, { label: cycle.cycleNo }]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/physical-count">{t("back")}</Link>
            </Button>
            {isEditable && (
              <Button
                onClick={() =>
                  completeCount.mutate(undefined, {
                    onSuccess: () => toast.success(t("completed")),
                  })
                }
                disabled={completeCount.isPending}
              >
                {t("completeCount")}
              </Button>
            )}
          </div>
        }
      />

      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{cycle.cycleNo}</CardTitle>
          <StatusBadge status={cycle.status} />
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-muted-foreground">{t("warehouse")}</p>
            <p className="font-medium">{cycle.warehouse.nameEn}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("conductedBy")}</p>
            <p className="font-medium">{cycle.conductedBy.fullNameEn}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("items")}</p>
            <p className="font-medium">{cycle.lines.length}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lines">
        <TabsList>
          <TabsTrigger value="lines">{t("countLines")}</TabsTrigger>
          <TabsTrigger value="variance">{t("varianceReport")}</TabsTrigger>
        </TabsList>
        <TabsContent value="lines" className="mt-4">
          <CountLineTable
            lines={cycle.lines}
            editable={isEditable}
            onCountChange={(lineId, countedQty) => updateLines.mutate({ lineId, countedQty })}
          />
        </TabsContent>
        <TabsContent value="variance" className="mt-4">
          <VarianceReport lines={cycle.lines} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
