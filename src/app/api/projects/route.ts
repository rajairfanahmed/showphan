import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createProjectDraft, getUserProjects } from "@/lib/projects";
import { ensureDatabaseSchema } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  try {
    await ensureDatabaseSchema();
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
        { status: 401 }
      );
    }

    const projects = await getUserProjects(session.user.id);
    return NextResponse.json({ projects });
  } catch (error: unknown) {
    logger.error("GET /api/projects failed", { requestId, error });
    const message = error instanceof Error ? error.message : "Failed to load projects.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? undefined;
  try {
    await ensureDatabaseSchema();
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sign in required." } },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Untitled Project";

    const project = await createProjectDraft(session.user.id, title);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project draft.";
    if (message.includes("PROJECT_LIMIT_REACHED")) {
      return NextResponse.json(
        { error: { code: "PROJECT_LIMIT_REACHED", message } },
        { status: 403 }
      );
    }
    logger.error("POST /api/projects failed", { requestId, error });
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
