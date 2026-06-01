"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import { calculatePareto, type ParetoItem } from "@/lib/utils/pareto";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";

export type ParetoChartProps = {
  items: ParetoItem[];
  height?: number;
};

export function ParetoChart({ items, height = 400 }: ParetoChartProps) {
  const t = useTranslations("reports");
  const result = calculatePareto(items);

  const chartData = result.items.map((item) => ({
    name: item.label.length > 20 ? `${item.label.slice(0, 18)}…` : item.label,
    value: item.value,
    cumulative: item.cumulativePercent,
    isVitalFew: item.isVitalFew,
  }));

  if (chartData.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{t("noData")}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v).replace("LKR", "")} />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "cumulative") return [formatPercent(Number(value)), t("cumulative")];
            return [formatCurrency(Number(value)), t("value")];
          }}
        />
        <Bar yAxisId="left" dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumulative"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
