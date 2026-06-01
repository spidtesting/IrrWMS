"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, { en: string; si: string }> = {
  dashboard: { en: "Dashboard", si: "උපකරණ පුවරුව" },
  inventory: { en: "Inventory", si: "ඉන්වෙන්ටරි" },
  inbound: { en: "Inbound", si: "ඇතුළුවීම්" },
  outbound: { en: "Outbound", si: "පිටවීම්" },
  orders: { en: "Orders", si: "ඇණවුම්" },
  warehouses: { en: "Warehouses", si: "ගබඩා" },
  users: { en: "Users", si: "පරිශීලකයින්" },
  reports: { en: "Reports", si: "වාර්තා" },
  settings: { en: "Settings", si: "සැකසුම්" },
  "audit-logs": { en: "Audit Logs", si: "විගණන ලොග්" },
  tasks: { en: "Tasks", si: "කාර්යයන්" },
};

type BreadcrumbProps = {
  className?: string;
  labels?: Record<string, { en: string; si: string }>;
};

export function Breadcrumb({ className, labels }: BreadcrumbProps) {
  const pathname = usePathname();
  const t = useTranslations("breadcrumb");
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = labels?.[segment] ?? SEGMENT_LABELS[segment];
    return { href, segment, label };
  });

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">{t("home")}</span>
      </Link>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const label = crumb.label ?? {
          en: crumb.segment.replace(/-/g, " "),
          si: crumb.segment.replace(/-/g, " "),
        };

        return (
          <Fragment key={crumb.href}>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                <BilingualLabel en={label.en} si={label.si} primary="en" />
              </span>
            ) : (
              <Link href={crumb.href} className="transition-colors hover:text-foreground">
                <BilingualLabel en={label.en} si={label.si} primary="en" />
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
