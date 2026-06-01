"use client";

import { QueryProvider } from "./QueryProvider";
import { RealtimeProvider } from "./RealtimeProvider";
import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <RealtimeProvider>{children}</RealtimeProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}

export { QueryProvider } from "./QueryProvider";
export { RealtimeProvider, useRealtimeContext } from "./RealtimeProvider";
export { SessionProvider } from "./SessionProvider";
export { ThemeProvider } from "./ThemeProvider";
