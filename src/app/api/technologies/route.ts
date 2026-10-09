import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTechnologies } from "@/lib/catalog";
import { slugify } from "@/lib/projects";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const technologies = await getTechnologies();
    return NextResponse.json({ technologies });
  } catch (error) {
    logger.error("Failed to fetch technologies", { error });
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to load technology catalog.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const rawName = typeof body.name === "string" ? body.name.trim() : "";

    if (!rawName || rawName.length > 40) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "Technology name must be between 1 and 40 characters.",
          },
        },
        { status: 400 }
      );
    }

    const slug = slugify(rawName);
    if (!slug) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "Invalid technology name.",
          },
        },
        { status: 400 }
      );
    }

    // Check if technology already exists
    const existing = await prisma.technology.findFirst({
      where: {
        OR: [
          { slug: slug.toLowerCase() },
          { name: { equals: rawName, mode: "insensitive" } },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ technology: existing });
    }

    // Create custom technology
    const created = await prisma.technology.create({
      data: {
        name: rawName,
        slug: slug.toLowerCase(),
        iconColor: "",
        iconMono: "",
      },
    });

    return NextResponse.json({ technology: created }, { status: 201 });
  } catch (error: unknown) {
    logger.error("POST /api/technologies failed", { requestId, error });
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create technology.",
        },
      },
      { status: 500 }
    );
  }
}
