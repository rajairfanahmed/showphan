import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const { projectIds } = body;

    if (!Array.isArray(projectIds)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_FAILED", message: "projectIds must be an array of IDs." } },
        { status: 400 }
      );
    }

    // Update positions sequentially
    await prisma.$transaction(
      projectIds.map((id, index) =>
        prisma.project.updateMany({
          where: { id, userId: session.user.id },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("PATCH /api/projects/reorder error:", error);
    const message = error instanceof Error ? error.message : "Failed to reorder projects.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
