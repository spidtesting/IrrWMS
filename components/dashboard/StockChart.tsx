"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import enMessages from "@/messages/en.json";
import siMessages from "@/messages/si.json";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockMovementPoint } from "@/types/dashboard";
import { format, parseISO } from "date-fns";

type StockChartProps = {
  data: StockMovementPoint[];
};

export function StockChart({ data }: StockChartProps) {
  const t = useTranslations("dashboard.charts");

  const chartData = data.map((point) => ({
    ...point,
    label: format(parseISO(point.date), "dd MMM"),
  }));

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>
          <BilingualLabel
            en={enMessages.dashboard.charts.stockMovement}
            si={siMessages.dashboard.charts.stockMovement}
            primary="en"
          />
        </CardTitle>
        <CardDescription>{t("stockMovementDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="inboundFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43 52% 54%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(43 52% 54%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "var(--radius)",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--popover))",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="inbound"
                name={t("inbound")}
                stroke="hsl(var(--primary))"
                fill="url(#inboundFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="outbound"
                name={t("outbound")}
                stroke="hsl(43 52% 54%)"
                fill="url(#outboundFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
