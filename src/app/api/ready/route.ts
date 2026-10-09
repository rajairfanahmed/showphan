import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        ready: true,
        timestamp: new Date().toISOString(),
        service: "showphan-web",
        database: {
          status: "connected",
          latencyMs,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Service not ready";
    return NextResponse.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
        service: "showphan-web",
        database: {
          status: "error",
          error,
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
