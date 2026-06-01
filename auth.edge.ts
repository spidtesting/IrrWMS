import NextAuth from "next-auth";
import authConfig from "@/auth.config";

/** Edge-safe auth for middleware (no bcrypt/prisma). */
export const { auth } = NextAuth(authConfig);
