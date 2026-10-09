import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userSlug = searchParams.get("slug") || "developer";
    const projectSlug = searchParams.get("project") || "showcase";

    let title = searchParams.get("title") || "Featured Project";
    let summary = "An engineering showcase built and verified on Showphan.";
    let authorName = "Developer";
    let kudosCount = 0;
    let technologies: string[] = ["TypeScript", "Next.js"];

    try {
      const user = await prisma.user.findUnique({
        where: { slug: userSlug },
        select: {
          id: true,
          name: true,
          displayName: true,
          slug: true,
        },
      });

      if (user) {
        authorName = user.displayName || user.name || userSlug;
        const project = await prisma.project.findUnique({
          where: {
            userId_slug: { userId: user.id, slug: projectSlug },
          },
          include: {
            technologies: {
              include: { technology: true },
            },
          },
        });

        if (project) {
          title = project.title;
          if (project.summary) summary = project.summary.slice(0, 140);
          kudosCount = project.kudosCount || 0;
          if (project.technologies.length > 0) {
            technologies = project.technologies.map((t) => t.technology.name).slice(0, 5);
          }
        }
      }
    } catch {
      // Fallback gracefully if database is unavailable
      title = projectSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            backgroundImage:
              "radial-gradient(circle at 85% 15%, #f59e0b1c 0%, transparent 55%), radial-gradient(circle at 15% 85%, #06b6d418 0%, transparent 50%)",
            color: "#ffffff",
            padding: "56px 64px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {/* Top Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#f59e0b20",
                  border: "2px solid #f59e0b60",
                  borderRadius: "10px",
                  color: "#f59e0b",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                S
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
                  Showphan
                </span>
                <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Project Showcase
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "#10b98115",
                border: "1px solid #10b98140",
                fontSize: "13px",
                color: "#34d399",
                fontWeight: "700",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "#10b981",
                }}
              />
              <span>Live Interactive Demo</span>
            </div>
          </div>

          {/* Project Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#a1a1aa", fontSize: "18px" }}>
              <span>By</span>
              <span style={{ color: "#ffffff", fontWeight: "700" }}>{authorName}</span>
              <span style={{ color: "#f59e0b", fontWeight: "600" }}>@{userSlug}</span>
            </div>

            <h1
              style={{
                fontSize: "52px",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: "1.15",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: "22px",
                color: "#a1a1aa",
                lineHeight: "1.4",
                margin: 0,
                maxWidth: "1000px",
              }}
            >
              {summary}
            </p>
          </div>

          {/* Bottom Metas: Kudos & Technologies */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid #27272a",
              width: "100%",
            }}
          >
            {/* Kudos Counter Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "10px",
                backgroundColor: "#f59e0b15",
                border: "1px solid #f59e0b40",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#f59e0b"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "#f59e0b" }}>
                {kudosCount}
              </span>
              <span style={{ fontSize: "13px", color: "#d97706", fontWeight: "700", textTransform: "uppercase" }}>
                Kudos
              </span>
            </div>

            {/* Technologies */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {technologies.map((tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    color: "#e4e4e7",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(`Failed to generate Project OpenGraph image: ${err.message}`, {
      status: 500,
    });
  }
}
