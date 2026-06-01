"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KPICardProps = {
  titleEn: string;
  titleSi: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  status?: "default" | "good" | "warning" | "critical";
  className?: string;
};

export function KPICard({
  titleEn,
  titleSi,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = "default",
  className,
}: KPICardProps) {
  const statusColors = {
    default: "text-primary",
    good: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    critical: "text-destructive",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <BilingualLabel en={titleEn} si={titleSi} primary="en" />
        </CardTitle>
        <div className={cn("rounded-md bg-muted p-2", statusColors[status])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {(subtitle || trend !== undefined) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {subtitle && <span>{subtitle}</span>}
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  trend >= 0 ? "text-emerald-600" : "text-destructive",
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
