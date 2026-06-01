import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types/auth";
import authConfig from "@/auth.config";

export const BCRYPT_ROUNDS = 12;
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

class AccountLockedError extends CredentialsSignin {
  code = "account_locked";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

function toUserRole(role: string): UserRole {
  return role as UserRole;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidCredentialsError();
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password || !user.isActive || user.deletedAt) {
          throw new InvalidCredentialsError();
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError();
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
          const nextAttempts = user.failedLoginAttempts + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: nextAttempts,
              ...(nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS
                ? { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) }
                : {}),
            },
          });

          if (nextAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
            throw new AccountLockedError();
          }

          throw new InvalidCredentialsError();
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.fullNameEn,
          image: user.image,
          role: toUserRole(user.role),
          warehouseId: user.warehouseId,
          fullNameEn: user.fullNameEn,
          fullNameSi: user.fullNameSi,
          employeeId: user.employeeId,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as {
          id: string;
          role: UserRole;
          warehouseId?: string | null;
          fullNameEn: string;
          fullNameSi: string;
          employeeId: string;
        };

        token.id = authUser.id;
        token.role = authUser.role;
        token.warehouseId = authUser.warehouseId ?? null;
        token.fullNameEn = authUser.fullNameEn;
        token.fullNameSi = authUser.fullNameSi;
        token.employeeId = authUser.employeeId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user = {
          ...session.user,
          id: (token.id as string) ?? token.sub,
          email: token.email ?? "",
          name: token.name ?? null,
          image: (token.picture as string | null) ?? null,
          role: (token.role as UserRole) ?? "VIEWER",
          warehouseId: (token.warehouseId as string | null) ?? null,
          fullNameEn: (token.fullNameEn as string) ?? "",
          fullNameSi: (token.fullNameSi as string) ?? "",
          employeeId: (token.employeeId as string) ?? "",
        };
      }

      return session;
    },
  },
});
