import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleBookmark, removeBookmark, getBookmarkStatus } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const status = await getBookmarkStatus(session.user.id, id);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load bookmark status.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  const { id } = await params;
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

    const result = await toggleBookmark(session.user.id, id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error("POST /api/projects/[id]/bookmark failed", {
      requestId,
      metadata: { projectId: id },
      error,
    });
    const message =
      error instanceof Error ? error.message : "Failed to update bookmark.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  const { id } = await params;
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

    const result = await removeBookmark(session.user.id, id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error("DELETE /api/projects/[id]/bookmark failed", {
      requestId,
      metadata: { projectId: id },
      error,
    });
    const message =
      error instanceof Error ? error.message : "Failed to remove bookmark.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
