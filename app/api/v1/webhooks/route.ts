import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { env } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { handleApiError, AuthError } from "@/lib/error-handler";
import { logger } from "@/lib/logger";

const webhookEventSchema = z.object({
  event: z.string().min(1).max(100),
  payload: z.record(z.unknown()),
  idempotencyKey: z.string().max(128).optional(),
});

function getWebhookSecret(): string {
  return env.CRON_SECRET ?? env.NEXTAUTH_SECRET;
}

function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;

  const secret = getWebhookSecret();
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  const provided = signatureHeader.replace(/^sha256=/, "");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(provided, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get("x-webhook-signature") ?? request.headers.get("x-signature-256");

    if (!verifyWebhookSignature(rawBody, signature)) {
      throw new AuthError("Invalid webhook signature");
    }

    const body = webhookEventSchema.parse(JSON.parse(rawBody));

    const existing = body.idempotencyKey
      ? await prisma.webhookDelivery.findFirst({
          where: {
            event: body.event,
            status: "PROCESSED",
          },
          orderBy: { createdAt: "desc" },
        })
      : null;

    if (existing && body.idempotencyKey) {
      return successResponse(
        { deliveryId: existing.id, status: existing.status, duplicate: true },
        { message: "Webhook already processed" },
      );
    }

    const delivery = await prisma.webhookDelivery.create({
      data: {
        event: body.event,
        payload: {
          ...body.payload,
          ...(body.idempotencyKey ? { idempotencyKey: body.idempotencyKey } : {}),
        },
        status: "PROCESSED",
        attempts: 1,
        lastAttemptAt: new Date(),
        responseCode: 200,
      },
    });

    logger.info({ event: body.event, deliveryId: delivery.id }, "Webhook processed");

    return successResponse(
      { deliveryId: delivery.id, status: delivery.status },
      { status: 201, message: "Webhook accepted" },
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.code, error.message, { status: error.statusCode });
    }
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = getWebhookSecret();

    if (authHeader !== `Bearer ${secret}`) {
      throw new AuthError("Unauthorized");
    }

    const pending = await prisma.webhookDelivery.findMany({
      where: { status: { in: ["PENDING", "FAILED"] } },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return successResponse({ pending, count: pending.length });
  } catch (error) {
    return handleApiError(error);
  }
}
