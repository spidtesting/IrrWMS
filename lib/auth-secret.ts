/**
 * NextAuth v5 reads AUTH_SECRET; older setups use NEXTAUTH_SECRET.
 * Mirror whichever is set so middleware (edge) and API routes agree.
 */
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
  const url = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();

  if (!url) {
    return undefined;
  }

  if (!process.env.AUTH_URL) {
    process.env.AUTH_URL = url;
  }
  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = url;
  }

  return url;
}

/** Call once before NextAuth initializes (auth.config / auth.edge). */
export function ensureAuthEnv(): void {
  resolveAuthSecret();
  resolveAuthUrl();
}
