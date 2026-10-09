import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addKudos, removeKudos, toggleKudos, getProjectKudosStatus } from "@/lib/projects";
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

    const status = await getProjectKudosStatus(id, session?.user?.id ?? null);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load kudos status.";
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
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Sign in with GitHub to award Kudos.",
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const isToggle = searchParams.get("toggle") === "true";

    if (isToggle) {
      const result = await toggleKudos(session.user.id, id);
      return NextResponse.json(result);
    }

    const result = await addKudos(session.user.id, id);
    if (result.alreadyVoted) {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_VOTED",
            message: "You have already awarded kudos to this project.",
          },
          kudosCount: result.kudosCount,
          trendingScore: result.trendingScore,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error("POST /api/projects/[id]/kudos failed", {
      requestId,
      metadata: { projectId: id },
      error,
    });
    const message =
      error instanceof Error ? error.message : "Failed to update kudos.";
    if (message === "PROJECT_NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found." } },
        { status: 404 }
      );
    }
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
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Sign in with GitHub to remove Kudos.",
          },
        },
        { status: 401 }
      );
    }

    const result = await removeKudos(session.user.id, id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error("DELETE /api/projects/[id]/kudos failed", {
      requestId,
      metadata: { projectId: id },
      error,
    });
    const message =
      error instanceof Error ? error.message : "Failed to remove kudos.";
    if (message === "PROJECT_NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found." } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

