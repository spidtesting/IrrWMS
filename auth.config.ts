import type { NextAuthConfig } from "next-auth";
import { ensureAuthEnv, resolveAuthSecret } from "@/lib/auth-secret";

ensureAuthEnv();

/**
 * Edge-compatible auth config (no bcrypt/prisma).
 * Used by middleware; full auth extends this in lib/auth.ts.
 */
const authSecret = resolveAuthSecret();

export const authConfig = {
  ...(authSecret ? { secret: authSecret } : {}),
  session: { strategy: "jwt" },
  basePath: "/api/v1/auth",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.includes("/login");
      if (isOnLogin) return true;
      return isLoggedIn;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export default authConfig;
