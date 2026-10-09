import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    const account = await prisma.account.findFirst({
      where: { userId: session.user.id, providerId: "github" },
    });

    const accessToken = account?.accessToken;
    const fetchHeaders: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Showphan-App",
    };

    if (accessToken) {
      fetchHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const githubRes = await fetch(
      "https://api.github.com/user/repos?type=public&sort=updated&per_page=50",
      { headers: fetchHeaders }
    );

    if (!githubRes.ok) {
      return NextResponse.json(
        {
          error: {
            code: "GITHUB_API_ERROR",
            message: `GitHub API error: ${githubRes.statusText}`,
          },
        },
        { status: githubRes.status }
      );
    }

    const data = await githubRes.json();
    const repositories = data.map((repo: {
      id: number;
      name: string;
      description?: string | null;
      html_url: string;
      homepage?: string | null;
      language?: string | null;
      topics?: string[];
    }) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "",
      htmlUrl: repo.html_url,
      homepage: repo.homepage || "",
      primaryLanguage: repo.language || "",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
    }));

    return NextResponse.json({ repositories });
  } catch (error: unknown) {
    logger.error("GET /api/github/repos failed", { requestId, error });
    const message = error instanceof Error ? error.message : "Failed to fetch repositories.";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
