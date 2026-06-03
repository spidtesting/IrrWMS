"use client";

import { useEffect, useState } from "react";

/** True after the first client paint — use to avoid SSR/client mismatches (theme, locale, etc.). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
