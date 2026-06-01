"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@/i18n/navigation";
import type { UserRole } from "@/types/auth";

type HeaderProps = {
  onOpenCommand?: () => void;
};

export function Header({ onOpenCommand }: HeaderProps) {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const t = useTranslations("layout");
  const tCommon = useTranslations("common");
  const toggleMobileOpen = useAppStore((state) => state.toggleMobileOpen);

  const user = session?.user as
    | {
        name?: string | null;
        image?: string | null;
        email?: string | null;
        role?: UserRole;
        fullNameEn?: string;
        fullNameSi?: string;
      }
    | undefined;

  const initials =
    user?.fullNameEn?.slice(0, 2).toUpperCase() ?? user?.name?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileOpen}
          aria-label={t("toggleSidebar")}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={onOpenCommand}
            placeholder={t("search")}
            className="h-9 pl-9 pr-16"
            aria-label={t("search")}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={onOpenCommand}
            aria-label={t("searchShortcut")}
          >
            <Search className="h-4 w-4" />
          </Button>

          <LanguageToggle />

          <ThemeToggle />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("notifications")}>
                <Bell className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <p className="text-sm font-medium">{t("notifications")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("noNotifications")}</p>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <BilingualLabel
                  en={user?.fullNameEn ?? user?.name ?? "User"}
                  si={user?.fullNameSi ?? user?.name ?? "පරිශීලක"}
                  primary="en"
                />
                <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                {user?.role && (
                  <p className="text-xs font-normal text-muted-foreground">{user.role}</p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  {tCommon("profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {tCommon("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="hidden border-t px-4 py-2 md:block">
        <Breadcrumb />
      </div>
    </header>
  );
}
