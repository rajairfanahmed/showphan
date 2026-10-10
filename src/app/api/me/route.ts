import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCoverImageFromR2 } from "@/lib/storage";
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        slug: true,
        bio: true,
        avatarUrl: true,
        searchVisible: true,
        createdAt: true,
      },
    });

    if (user && user.slug === "raja-irfan-ahmed") {
      const cleanSlug = "rajairfanahmed";
      const conflict = await prisma.user.findUnique({ where: { slug: cleanSlug } });
      if (!conflict || conflict.id === user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { slug: cleanSlug },
        });
        user.slug = cleanSlug;
      }
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    logger.error("GET /api/me failed", { requestId, error });
    const message = error instanceof Error ? error.message : "Failed to load profile.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const updateData: { displayName?: string; bio?: string; searchVisible?: boolean; slug?: string } = {};

    if (body.displayName !== undefined) {
      updateData.displayName = String(body.displayName).trim();
    }
    if (body.bio !== undefined) {
      updateData.bio = String(body.bio).trim().slice(0, 160);
    }
    if (body.searchVisible !== undefined) {
      updateData.searchVisible = Boolean(body.searchVisible);
    }
    if (body.slug !== undefined) {
      const cleanSlug = String(body.slug).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (cleanSlug.length < 2 || cleanSlug.length > 39) {
        return NextResponse.json(
          { error: { code: "INVALID_SLUG", message: "Profile handle must be between 2 and 39 characters." } },
          { status: 400 }
        );
      }
      const existingUserWithSlug = await prisma.user.findUnique({
        where: { slug: cleanSlug },
      });
      if (existingUserWithSlug && existingUserWithSlug.id !== session.user.id) {
        return NextResponse.json(
          { error: { code: "SLUG_TAKEN", message: "This profile handle is already taken by another developer." } },
          { status: 409 }
        );
      }
      updateData.slug = cleanSlug;
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ user: updated });
  } catch (error: unknown) {
    logger.error("PATCH /api/me failed", { requestId, error });
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    // 1. Fetch user projects to purge R2 images
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: { coverImageKey: true },
    });

    for (const proj of projects) {
      if (proj.coverImageKey) {
        await deleteCoverImageFromR2(proj.coverImageKey);
      }
    }

    // 2. Cascade delete user account from database
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true, message: "Account deleted." });
  } catch (error: unknown) {
    logger.error("DELETE /api/me failed", { requestId, error });
    const message = error instanceof Error ? error.message : "Failed to delete account.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
