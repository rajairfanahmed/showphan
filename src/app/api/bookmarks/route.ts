import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserBookmarksDetailed } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
        { status: 401 }
      );
    }

    const bookmarks = await getUserBookmarksDetailed(session.user.id);
    return NextResponse.json({ bookmarks });
  } catch (error: unknown) {
    logger.error("GET /api/bookmarks failed", { requestId, error });
    const message =
      error instanceof Error ? error.message : "Failed to load bookmarks.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
