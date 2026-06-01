import crypto from "crypto";
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { handleApiError } from "@/lib/error-handler";
import { successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = forgotPasswordSchema.parse(await request.json());
    const email = body.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullNameEn: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (user?.isActive && !user.deletedAt) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}`;

      await sendPasswordResetEmail(user.email, resetUrl, user.fullNameEn);
      logger.info({ userId: user.id }, "Password reset email queued");
    }

    return successResponse(
      { sent: true },
      {
        message: "If an account exists for that email, a reset link has been sent.",
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
