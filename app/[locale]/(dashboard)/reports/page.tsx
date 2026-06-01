"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { BarChart3, Calendar, CalendarDays, FileBarChart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reportLinks = [
  {
    href: "/reports/daily",
    icon: Calendar,
    titleKey: "daily",
    descKey: "dailyDesc",
  },
  {
    href: "/reports/monthly",
    icon: CalendarDays,
    titleKey: "monthly",
    descKey: "monthlyDesc",
  },
  {
    href: "/reports/pareto",
    icon: TrendingUp,
    titleKey: "pareto",
    descKey: "paretoDesc",
  },
  {
    href: "/reports/annual",
    icon: FileBarChart,
    titleKey: "annual",
    descKey: "annualDesc",
  },
] as const;

export default function ReportsPage() {
  const t = useTranslations("reports");

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="grid gap-4 md:grid-cols-2">
        {reportLinks.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.href} href={report.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{t(report.titleKey)}</CardTitle>
                      <CardDescription>{t(report.descKey)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary">{t("viewReport")} →</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
