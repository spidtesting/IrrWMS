import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let database: "ok" | "error" = "ok";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = "error";
  }

  return successResponse({
    status: database === "ok" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database,
    },
  });
}
