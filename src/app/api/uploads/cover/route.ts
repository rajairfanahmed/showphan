import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresignedCoverUpload } from "@/lib/storage";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

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

    const body = await req.json().catch(() => ({}));
    const { mimeType, fileSize } = body;

    if (!mimeType || typeof fileSize !== "number") {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "mimeType and fileSize are required.",
          },
        },
        { status: 400 }
      );
    }

    const presigned = await createPresignedCoverUpload(
      session.user.id,
      mimeType,
      fileSize
    );

    return NextResponse.json(presigned);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create upload URL.";
    if (message.includes("INVALID_FILE_TYPE")) {
      return NextResponse.json(
        { error: { code: "INVALID_FILE_TYPE", message } },
        { status: 400 }
      );
    }
    if (message.includes("FILE_TOO_LARGE")) {
      return NextResponse.json(
        { error: { code: "FILE_TOO_LARGE", message } },
        { status: 400 }
      );
    }
    logger.error("POST /api/uploads/cover failed", { requestId, error });
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
