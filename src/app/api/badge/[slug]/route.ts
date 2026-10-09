import { NextRequest, NextResponse } from "next/server";
import { getDeveloperBadgeData, renderBadgeSvg } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const requestId = req.headers.get("x-request-id") ?? undefined;

  try {
    const data = await getDeveloperBadgeData(slug);

    if (!data) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: `User @${slug} not found.` } },
        { status: 404 }
      );
    }

    const svg = renderBadgeSvg(data);

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    logger.error("GET /api/badge/[slug] failed", {
      requestId,
      metadata: { slug },
      error,
    });
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to render badge." } },
      { status: 500 }
    );
  }
}
