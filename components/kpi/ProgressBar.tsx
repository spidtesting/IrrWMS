"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/formatters";

export type ProgressBarProps = {
  label: string;
  value: number;
  target?: number;
  className?: string;
};

export function KPIProgressBar({ label, value, target = 100, className }: ProgressBarProps) {
  const t = useTranslations("kpi");
  const percent = Math.min((value / target) * 100, 100);
  const isBelowTarget = value < target * 0.8;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("font-mono", isBelowTarget ? "text-destructive" : "text-emerald-600")}>
          {formatPercent(value, 1)}
          {target !== 100 && (
            <span className="ml-1 text-muted-foreground">/ {formatPercent(target, 1)}</span>
          )}
        </span>
      </div>
      <Progress value={percent} className={cn("h-2", isBelowTarget && "[&>div]:bg-destructive")} />
      {isBelowTarget && <p className="text-xs text-destructive">{t("belowTarget")}</p>}
    </div>
  );
}
