"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Warehouse } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { canAccessRoute } from "@/lib/constants/roles";
import type { UserRole } from "@/types/auth";
import { useAppStore } from "@/store/useAppStore";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SidebarProps = {
  warehouseNameEn: string;
  warehouseNameSi: string;
};

function navLabelKey(key: string): string {
  return key === "audit-logs" ? "auditLogs" : key;
}

export function Sidebar({ warehouseNameEn, warehouseNameSi }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const isCollapsed = useAppStore((state) => state.isCollapsed);
  const toggleCollapsed = useAppStore((state) => state.toggleCollapsed);

  const userRole = (session?.user as { role?: UserRole } | undefined)?.role;

  const visibleItems = NAV_ITEMS.filter((item) =>
    userRole ? canAccessRoute(userRole, item.key) : false,
  );

  const mainItems = visibleItems.filter((item) => item.group === "main");
  const adminItems = visibleItems.filter((item) => item.group === "admin");

  const renderGroup = (titleKey: string, items: typeof mainItems) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-1">
        {!isCollapsed && (
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            {t(titleKey)}
          </p>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.key}
              href={item.href}
              title={t(navLabelKey(item.key))}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isCollapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{t(navLabelKey(item.key))}</span>}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex",
        isCollapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-sidebar-border px-4 py-4",
          isCollapsed && "justify-center px-2",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Warehouse className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              IrrWMS
            </p>
            <BilingualLabel
              en={warehouseNameEn}
              si={warehouseNameSi}
              primary="en"
              className="text-sm font-medium text-sidebar-foreground"
              secondaryClassName="text-sidebar-foreground/60 text-[11px]"
            />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-4">
          {renderGroup("main", mainItems)}
          {adminItems.length > 0 && (
            <>
              <Separator className="bg-sidebar-border" />
              {renderGroup("admin", adminItems)}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-2">
        <Button
          type="button"
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={cn(
            "w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            !isCollapsed && "justify-start gap-2",
          )}
          onClick={toggleCollapsed}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
