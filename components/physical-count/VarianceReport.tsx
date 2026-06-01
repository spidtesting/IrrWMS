"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatQuantity } from "@/lib/utils/formatters";
import type { PhysicalCountLine } from "@/types/entities";

export type VarianceReportProps = {
  lines: PhysicalCountLine[];
};

export function VarianceReport({ lines }: VarianceReportProps) {
  const t = useTranslations("physicalCount");

  const withVariance = lines.filter((l) => l.countedQty != null && l.countedQty !== l.expectedQty);
  const totalVariance = withVariance.reduce(
    (sum, l) => sum + Math.abs((l.countedQty ?? 0) - l.expectedQty),
    0,
  );
  const accuracy =
    lines.length === 0 ? 100 : ((lines.length - withVariance.length) / lines.length) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("accuracy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{formatPercent(accuracy, 1)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("varianceItems")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{withVariance.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalVariance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatQuantity(totalVariance)}</p>
        </CardContent>
      </Card>

      {withVariance.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">{t("varianceDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {withVariance.map((line) => {
                const diff = (line.countedQty ?? 0) - line.expectedQty;
                return (
                  <li key={line.id} className="flex justify-between border-b pb-2 text-sm">
                    <span>{line.item.nameEn}</span>
                    <span className={diff < 0 ? "text-destructive" : "text-emerald-600"}>
                      {diff > 0 ? "+" : ""}
                      {formatQuantity(diff, line.item.unit)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
