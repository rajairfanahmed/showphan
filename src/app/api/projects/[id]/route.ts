import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateProject, deleteProject } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const updated = await updateProject(session.user.id, id, body);
    return NextResponse.json({ project: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project.";
    if (message.includes("NOT_FOUND")) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message } },
        { status: 404 }
      );
    }
    if (message.includes("STALE_UPDATE")) {
      return NextResponse.json(
        { error: { code: "STALE_UPDATE", message } },
        { status: 409 }
      );
    }
    logger.error("PATCH /api/projects/:id failed", { requestId, error });
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

    const { id } = await params;
    const result = await deleteProject(session.user.id, id);

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project.";
    if (message.includes("NOT_FOUND")) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message } },
        { status: 404 }
      );
    }
    logger.error("DELETE /api/projects/:id failed", { requestId, error });
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
