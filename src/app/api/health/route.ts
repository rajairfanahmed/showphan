import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const checks: {
    database: { status: "connected" | "error"; latencyMs?: number; error?: string };
    storage: { status: "configured" | "missing_config"; provider: string };
  } = {
    database: { status: "error" },
    storage: { status: "missing_config", provider: "Cloudflare R2" },
  };

  let isHealthy = true;

  // 1. Database Health & Latency Check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: "connected",
      latencyMs: Date.now() - dbStart,
    };
  } catch (err: unknown) {
    isHealthy = false;
    const message = err instanceof Error ? err.message : "Database connection failed";
    checks.database = {
      status: "error",
      error: message,
    };
  }

  // 2. Storage Credentials Verification
  const r2Configured = Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME
  );

  checks.storage = {
    status: r2Configured ? "configured" : "missing_config",
    provider: "Cloudflare R2",
  };

  if (!r2Configured) {
    isHealthy = false;
  }

  if (!isHealthy) {
    logger.error("Health check reported degraded/unhealthy status", {
      durationMs: Date.now() - startTime,
      metadata: checks,
    });
  }

  const responsePayload = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    totalLatencyMs: Date.now() - startTime,
    checks,
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
