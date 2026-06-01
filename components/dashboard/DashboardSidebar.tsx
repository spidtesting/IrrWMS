"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  PackageMinus,
  PackagePlus,
  ScrollText,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navGroups: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "nav.overview",
    items: [
      { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
      { href: "/kpi", labelKey: "nav.kpi", icon: BarChart3 },
    ],
  },
  {
    titleKey: "nav.operations",
    items: [
      { href: "/inventory", labelKey: "nav.inventory", icon: Boxes },
      { href: "/goods-received", labelKey: "nav.goodsReceived", icon: PackagePlus },
      { href: "/goods-issued", labelKey: "nav.goodsIssued", icon: PackageMinus },
      { href: "/stock-entry", labelKey: "nav.stockEntry", icon: ClipboardList },
      { href: "/physical-count", labelKey: "nav.physicalCount", icon: ClipboardCheck },
      { href: "/damage-reports", labelKey: "nav.damageReports", icon: Shield },
    ],
  },
  {
    titleKey: "nav.procurement",
    items: [
      { href: "/purchase-orders", labelKey: "nav.purchaseOrders", icon: ShoppingCart },
      { href: "/suppliers", labelKey: "nav.suppliers", icon: Truck },
    ],
  },
  {
    titleKey: "nav.management",
    items: [
      { href: "/warehouse", labelKey: "nav.warehouse", icon: Warehouse },
      { href: "/staff", labelKey: "nav.staff", icon: Users },
      { href: "/reports", labelKey: "nav.reports", icon: FileText },
      { href: "/audit-logs", labelKey: "nav.auditLogs", icon: ScrollText },
    ],
  },
  {
    titleKey: "nav.system",
    items: [
      { href: "/notifications", labelKey: "nav.notifications", icon: Bell },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const isCollapsed = useAppStore((s) => s.isCollapsed);
  const toggleCollapsed = useAppStore((s) => s.toggleCollapsed);

  const pathWithoutLocale = pathname.replace(/^\/(en|si)/, "") || pathname;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b bg-primary px-4 text-primary-foreground">
        <Package className="h-6 w-6 shrink-0" />
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">IrrWMS</p>
            <p className="truncate text-[10px] opacity-80">{t("common.appName")}</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-2">
          {navGroups.map((group) => (
            <div key={group.titleKey}>
              {!isCollapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.titleKey)}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathWithoutLocale === item.href ||
                    pathWithoutLocale.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                        title={isCollapsed ? t(item.labelKey) : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span>{t(item.labelKey)}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={toggleCollapsed}
          aria-label={t("nav.toggleSidebar")}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
          />
        </Button>
      </div>
    </aside>
  );
}
