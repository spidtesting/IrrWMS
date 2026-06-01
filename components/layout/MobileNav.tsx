"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Warehouse } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { canAccessRoute } from "@/lib/constants/roles";
import type { UserRole } from "@/types/auth";
import { useAppStore } from "@/store/useAppStore";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  warehouseNameEn: string;
  warehouseNameSi: string;
};

function navLabelKey(key: string): string {
  return key === "audit-logs" ? "auditLogs" : key;
}

export function MobileNav({ warehouseNameEn, warehouseNameSi }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const isMobileOpen = useAppStore((state) => state.isMobileOpen);
  const setMobileOpen = useAppStore((state) => state.setMobileOpen);

  const userRole = (session?.user as { role?: UserRole } | undefined)?.role;

  const visibleItems = NAV_ITEMS.filter((item) =>
    userRole ? canAccessRoute(userRole, item.key) : false,
  );

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
        <SheetHeader className="border-b border-sidebar-border px-4 py-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-sidebar-foreground">IrrWMS</SheetTitle>
              <BilingualLabel
                en={warehouseNameEn}
                si={warehouseNameSi}
                primary="en"
                className="text-xs text-sidebar-foreground/70"
              />
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)] px-2 py-4">
          <nav className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(navLabelKey(item.key))}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-4 bg-sidebar-border" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
