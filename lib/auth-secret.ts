/**
 * NextAuth v5 secret resolution.
 * Supports NEXTAUTH_SECRET and AUTH_SECRET (v5 alias).
 */

const PLACEHOLDER_SECRETS = new Set([
  "generate-a-secure-random-string-at-least-32-chars",
  "changeme",
  "",
]);

export function resolveAuthSecret(): string | undefined {
  const secret =
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || undefined;

  if (!secret || PLACEHOLDER_SECRETS.has(secret) || secret.length < 32) {
    return undefined;
  }

  return secret;
}

/** Mirror NEXTAUTH_SECRET → AUTH_SECRET for Auth.js v5. */
export function ensureAuthEnv(): void {
  const secret = resolveAuthSecret();
  if (!secret) {
    return;
  }

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = secret;
  }
  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = secret;
  }
  if (!process.env.AUTH_URL && process.env.NEXTAUTH_URL) {
    process.env.AUTH_URL = process.env.NEXTAUTH_URL;
  }
}
