"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, Package } from "lucide-react";
import { DASHBOARD_NAV_GROUPS } from "@/lib/constants/dashboard-navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const isCollapsed = useAppStore((s) => s.isCollapsed);
  const toggleCollapsed = useAppStore((s) => s.toggleCollapsed);

  const pathWithoutLocale = pathname.replace(/^\/(en|si)/, "") || pathname;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-card transition-all duration-300 lg:flex",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b bg-primary px-4 text-primary-foreground">
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
          {DASHBOARD_NAV_GROUPS.map((group) => (
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
                          isCollapsed && "justify-center px-2",
                        )}
                        title={isCollapsed ? t(item.labelKey) : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t p-2">
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
