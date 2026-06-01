"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const t = useTranslations("layout");

  const switchLocale = (next: "en" | "si") => {
    if (next === locale) return;
    setLanguage(next);
    setLocaleCookie(next);
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted/50 p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label={t("commandPalette")}
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className="text-muted-foreground/50" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => switchLocale("si")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "si"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "si"}
      >
        සිං
      </button>
    </div>
  );
}
