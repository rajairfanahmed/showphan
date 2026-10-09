import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getExploreProjects } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  try {
    const { searchParams } = new URL(req.url);
    const tabParam = searchParams.get("tab");
    const techSlug = searchParams.get("tech") ?? undefined;
    const query = searchParams.get("q") ?? undefined;

    const tab =
      tabParam === "newest" || tabParam === "kudos" ? tabParam : "trending";

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const data = await getExploreProjects({
      tab,
      techSlug,
      query,
      userId: session?.user?.id,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("GET /api/explore failed", { requestId, error });
    const message =
      error instanceof Error ? error.message : "Failed to load explore catalog.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
