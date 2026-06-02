"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { DASHBOARD_NAV_GROUPS } from "@/lib/constants/dashboard-navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function DashboardMobileNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const isMobileOpen = useAppStore((s) => s.isMobileOpen);
  const setMobileOpen = useAppStore((s) => s.setMobileOpen);

  const pathWithoutLocale = pathname.replace(/^\/(en|si)/, "") || pathname;

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-[min(18rem,85vw)] p-0 sm:w-72">
        <SheetHeader className="border-b bg-primary px-4 py-4 text-left text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-primary-foreground">IrrWMS</SheetTitle>
              <p className="truncate text-xs text-primary-foreground/80">{t("common.appName")}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100dvh-5rem)]">
          <nav className="space-y-6 px-2 py-4">
            {DASHBOARD_NAV_GROUPS.map((group, groupIndex) => (
              <div key={group.titleKey}>
                {groupIndex > 0 && <Separator className="mb-4" />}
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.titleKey)}
                </p>
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
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {t(item.labelKey)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
