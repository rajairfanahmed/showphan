import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCoverImageFromR2 } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("GET /api/me error:", error);
    const message = error instanceof Error ? error.message : "Failed to load profile.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

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
    const updateData: { displayName?: string; bio?: string; searchVisible?: boolean } = {};

    if (body.displayName !== undefined) {
      updateData.displayName = String(body.displayName).trim();
    }
    if (body.bio !== undefined) {
      updateData.bio = String(body.bio).trim().slice(0, 160);
    }
    if (body.searchVisible !== undefined) {
      updateData.searchVisible = Boolean(body.searchVisible);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ user: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/me error:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    console.error("DELETE /api/me error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete account.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
