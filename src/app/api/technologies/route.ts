import { NextResponse } from "next/server";
import { getTechnologies } from "@/lib/catalog";
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
