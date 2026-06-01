/**
 * Optional Sentry integration stub.
 * Install @sentry/nextjs and uncomment initialization when ready for production monitoring.
 */

export type SentryUser = {
  id: string;
  email?: string;
  role?: string;
};

export function initSentry(): void {
  if (process.env.SENTRY_DSN) {
    // eslint-disable-next-line no-console
    console.info("[sentry] SENTRY_DSN set — install @sentry/nextjs to enable");
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error("[sentry stub]", error, context);
  }
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[sentry stub:${level}]`, message);
  }
}

export function setSentryUser(_user: SentryUser | null): void {
  // no-op until @sentry/nextjs is wired
}
