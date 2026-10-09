import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateQualityGate } from "@/lib/projects/quality-gate";
import { ProjectStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
      include: {
        technologies: true,
        user: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found or access denied." } },
        { status: 404 }
      );
    }

    const evaluation = evaluateQualityGate(project);
    if (!evaluation.canPublish) {
      return NextResponse.json(
        {
          error: {
            code: "QUALITY_GATE_FAILED",
            message: "Project cannot be published until all quality rules are satisfied.",
            missingRules: evaluation.missingRules,
          },
        },
        { status: 422 }
      );
    }

    const published = await prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.PUBLISHED,
      },
    });

    const userSlug = project.user.slug;
    const projectSlug = published.slug;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";
    const publicUrl = `${baseUrl}/${userSlug}/${projectSlug}`;

    return NextResponse.json({
      project: published,
      publicUrl,
    });
  } catch (error: unknown) {
    console.error("POST /api/projects/:id/publish error:", error);
    const message = error instanceof Error ? error.message : "Failed to publish project.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
