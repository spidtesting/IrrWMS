"use client";

import { useCallback, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";

export type AppLanguage = "en" | "si";

const labels = {
  en: {
    code: "EN",
    name: "English",
    nativeName: "English",
  },
  si: {
    code: "SI",
    name: "Sinhala",
    nativeName: "සිංහල",
  },
} as const;

export function useLanguage() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "si" : "en");
  }, [language, setLanguage]);

  const meta = useMemo(() => labels[language], [language]);

  const t = useCallback((en: string, si: string) => (language === "si" ? si : en), [language]);

  return {
    language,
    setLanguage,
    toggleLanguage,
    meta,
    t,
    isSinhala: language === "si",
  };
}
