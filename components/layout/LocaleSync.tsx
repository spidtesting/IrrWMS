"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useAppStore } from "@/store/useAppStore";

export function LocaleSync() {
  const locale = useLocale();
  const setLanguage = useAppStore((state) => state.setLanguage);

  useEffect(() => {
    if (locale === "en" || locale === "si") {
      setLanguage(locale);
    }
  }, [locale, setLanguage]);

  return null;
}
