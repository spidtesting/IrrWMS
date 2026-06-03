import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

function sanitizeDbError(message: string): string {
  return message
    .replace(/postgresql:\/\/[^\s]+/gi, "postgresql://***")
    .replace(/password[=][^\s&]+/gi, "password=***");
}

function databaseHint(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("can't reach database") || lower.includes("econnrefused")) {
    return "Cannot reach Postgres host. Use Supabase session URL port 5432 and check project is active.";
  }
  if (lower.includes("password authentication failed")) {
    return "Wrong database password. URL-encode special characters in Railway Variables (@ → %40).";
  }
  if (lower.includes("ssl") || lower.includes("tls") || lower.includes("encrypt")) {
    return "Add ?sslmode=require to DATABASE_URL (Supabase requires SSL).";
  }
  if (lower.includes("timed out") || lower.includes("timeout")) {
    return "Connection timed out. In Supabase: Settings → Database → disable IP restrictions or allow Railway.";
  }
  if (lower.includes("pgbouncer") || lower.includes("prepared statement")) {
    return "Use session mode (port 5432), not transaction pooler (6543), for Railway.";
  }
  return "Check DATABASE_URL and DIRECT_URL in Railway Variables (Supabase session URI, port 5432).";
}

export async function GET() {
  let database: "ok" | "error" = "ok";
  let databaseError: string | undefined;
  let hint: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "error";
    const message = error instanceof Error ? error.message : "Unknown database error";
    databaseError = sanitizeDbError(message);
    hint = databaseHint(message);
  }

  return successResponse({
    status: database === "ok" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database,
      ...(databaseError ? { databaseError, hint } : {}),
    },
  });
}
