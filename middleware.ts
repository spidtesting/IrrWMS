import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth.edge";
import { canAccessRoute } from "@/lib/constants/roles";
import type { UserRole } from "@/types/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const apiAuthPrefix = "/api/v1/auth";
const staticFilePattern = /\.(.*)$/;

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/unauthorized"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

function getPathnameWithoutLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function getRouteKey(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ?? null;
}

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith(apiAuthPrefix) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    staticFilePattern.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role as UserRole | undefined;

  if (isAuthRoute(pathWithoutLocale) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isPublicRoute(pathWithoutLocale) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && userRole) {
    const routeKey = getRouteKey(pathWithoutLocale);

    if (routeKey && !canAccessRoute(userRole, routeKey)) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return intlMiddleware(req as NextRequest);
});

export const config = {
  matcher: ["/((?!api/v1/auth|_next|_vercel|.*\\..*).*)"],
};
