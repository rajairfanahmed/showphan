import { NextRequest, NextResponse } from "next/server";
import {
  getProjectReactions,
  toggleProjectReaction,
  VALID_REACTION_TYPES,
  ReactionType,
} from "@/lib/projects/reactions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Project ID is required." },
        { status: 400 }
      );
    }

    const counts = await getProjectReactions(id);
    return NextResponse.json({ counts });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Project ID is required." },
        { status: 400 }
      );
    }

    let body: { reaction?: string; visitorId?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_JSON", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { reaction, visitorId } = body;

    if (!reaction || !VALID_REACTION_TYPES.includes(reaction as ReactionType)) {
      return NextResponse.json(
        {
          error: "INVALID_REACTION",
          message: `Reaction must be one of: ${VALID_REACTION_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Determine visitor identification (from body, header, or fallback)
    const effectiveVisitorId =
      visitorId ||
      req.headers.get("x-forwarded-for") ||
      req.headers.get("user-agent") ||
      "anonymous-peer";

    const result = await toggleProjectReaction(
      id,
      reaction as ReactionType,
      effectiveVisitorId
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
