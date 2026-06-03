/**
 * NextAuth v5 reads AUTH_SECRET; older setups use NEXTAUTH_SECRET.
 * Public URL must not use 0.0.0.0 (Railway bind address) — use RAILWAY_PUBLIC_DOMAIN when unset.
 */

function isBlockedAuthHost(hostname: string): boolean {
  return hostname === "0.0.0.0" || hostname === "[::]";
}

function normalizeAuthUrl(raw: string): string {
  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Invalid auth URL protocol: ${url.protocol}`);
  }
  if (isBlockedAuthHost(url.hostname)) {
    throw new Error(`Invalid auth URL host: ${url.hostname}`);
  }
  return url.origin;
}

function railwayPublicOrigin(): string | undefined {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (!domain) return undefined;
  return `https://${domain}`;
}

export function resolveAuthSecret(): string | undefined {
  const secret = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    return undefined;
  }

  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = secret;
  }
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = secret;
  }

  return secret;
}

export function resolveAuthUrl(): string | undefined {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    railwayPublicOrigin(),
  ];

  for (const raw of candidates) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;

    try {
      const origin = normalizeAuthUrl(trimmed);
      process.env.AUTH_URL = origin;
      process.env.NEXTAUTH_URL = origin;
      if (!process.env.NEXT_PUBLIC_APP_URL?.trim()) {
        process.env.NEXT_PUBLIC_APP_URL = origin;
      }
      return origin;
    } catch {
      continue;
    }
  }

  return undefined;
}

/** Call before NextAuth / env validation so Railway can infer the public URL. */
export function ensureAuthEnv(): void {
  resolveAuthSecret();
  resolveAuthUrl();
}

export function isAuthConfigured(): boolean {
  return Boolean(resolveAuthSecret() && resolveAuthUrl());
}
