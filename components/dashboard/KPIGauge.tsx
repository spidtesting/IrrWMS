"use client";

import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getKpiStatus, type KpiKey } from "@/lib/constants/kpi-targets";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type KPIGaugeProps = {
  kpiKey: KpiKey;
  labelEn: string;
  labelSi: string;
  value: number;
  target: number;
  unit: string;
  className?: string;
};

export function KPIGauge({
  kpiKey,
  labelEn,
  labelSi,
  value,
  target,
  unit,
  className,
}: KPIGaugeProps) {
  const t = useTranslations("dashboard.gauge");
  const status = getKpiStatus(kpiKey, value);
  const progress = target > 0 ? Math.min(100, (value / target) * 100) : 0;

  const statusClass = {
    good: "text-emerald-600",
    warning: "text-amber-600",
    critical: "text-destructive",
  }[status];

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          <BilingualLabel en={labelEn} si={labelSi} primary="en" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <span className={cn("text-2xl font-bold tabular-nums", statusClass)}>
            {value.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {t("target")}: {target}
            {unit}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {progress.toFixed(0)}% {t("ofTarget")}
        </p>
      </CardContent>
    </Card>
  );
}
