"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { COMMAND_NAV_ITEMS } from "@/lib/constants/navigation";
import { canAccessRoute } from "@/lib/constants/roles";
import type { UserRole } from "@/types/auth";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("layout");
  const tNav = useTranslations("nav");

  const userRole = (session?.user as { role?: UserRole } | undefined)?.role;

  const visibleItems = COMMAND_NAV_ITEMS.filter((item) =>
    userRole ? canAccessRoute(userRole, item.key) : true,
  );

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useKeyboardShortcut(["ctrl", "k"], toggle);
  useKeyboardShortcut(["meta", "k"], toggle);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("commandPlaceholder")} />
      <CommandList>
        <CommandEmpty>{t("commandEmpty")}</CommandEmpty>
        <CommandGroup heading={t("commandNavigation")}>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.key}
                value={`${item.key} ${tNav(item.key === "audit-logs" ? "auditLogs" : item.key)}`}
                onSelect={() => navigate(item.href)}
              >
                <Icon className="h-4 w-4" />
                <span>{tNav(item.key === "audit-logs" ? "auditLogs" : item.key)}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
      <div className="border-t px-3 py-2 text-xs text-muted-foreground">
        <CommandShortcut>⌘</CommandShortcut>
        <CommandShortcut className="ml-0.5">K</CommandShortcut>
      </div>
    </CommandDialog>
  );
}
