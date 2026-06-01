"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslations } from "next-intl";
import { formatPercent } from "@/lib/utils/formatters";

export type KPIChartDataPoint = {
  label: string;
  inventoryAccuracy?: number;
  orderFulfillmentRate?: number;
  stockTurnoverRate?: number;
  staffProductivity?: number;
};

export type KPIChartProps = {
  data: KPIChartDataPoint[];
  metrics?: (keyof KPIChartDataPoint)[];
  height?: number;
};

const METRIC_COLORS: Record<string, string> = {
  inventoryAccuracy: "hsl(var(--primary))",
  orderFulfillmentRate: "hsl(var(--secondary))",
  stockTurnoverRate: "#059669",
  staffProductivity: "#d97706",
};

export function KPIChart({
  data,
  metrics = ["inventoryAccuracy", "orderFulfillmentRate"],
  height = 320,
}: KPIChartProps) {
  const t = useTranslations("kpi");

  if (data.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{t("noData")}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(v) => formatPercent(Number(v), 1)} />
        <Legend />
        {metrics.map((metric) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            name={t(metric as string)}
            stroke={METRIC_COLORS[metric] ?? "hsl(var(--primary))"}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
