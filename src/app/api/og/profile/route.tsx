import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "developer";

    let name = "Developer Profile";
    let bio = "Showcasing high-impact engineering projects on Showphan.";
    let publishedCount = 0;
    let totalKudos = 0;
    let topTechs: string[] = ["TypeScript", "Next.js", "React", "Node.js"];

    try {
      const user = await prisma.user.findUnique({
        where: { slug },
        select: {
          name: true,
          displayName: true,
          slug: true,
          bio: true,
          projects: {
            where: { status: "PUBLISHED" },
            select: {
              kudosCount: true,
              technologies: {
                select: {
                  technology: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      });

      if (user) {
        name = user.displayName || user.name || slug;
        if (user.bio) bio = user.bio.slice(0, 110);
        publishedCount = user.projects.length;
        totalKudos = user.projects.reduce((sum, p) => sum + (p.kudosCount || 0), 0);

        const techSet = new Set<string>();
        for (const p of user.projects) {
          for (const t of p.technologies) {
            techSet.add(t.technology.name);
          }
        }
        if (techSet.size > 0) {
          topTechs = Array.from(techSet).slice(0, 4);
        }
      }
    } catch {
      // Graceful fallback if database unavailable during offline/static generation
      name = slug.charAt(0).toUpperCase() + slug.slice(1);
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
            backgroundImage: "radial-gradient(circle at 90% 10%, #f59e0b18 0%, transparent 60%), radial-gradient(circle at 10% 90%, #10b98115 0%, transparent 50%)",
            color: "#ffffff",
            padding: "56px 64px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {/* Top Brand Header */}
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
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f59e0b20",
                  border: "2px solid #f59e0b60",
                  borderRadius: "12px",
                  color: "#f59e0b",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                S
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
                  Showphan
                </span>
                <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Verified Developer Portfolio
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                fontSize: "14px",
                color: "#a1a1aa",
                fontWeight: "600",
              }}
            >
              <span>showphan.com/@{slug}</span>
            </div>
          </div>

          {/* Center Identity Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "900",
                  color: "#ffffff",
                  lineHeight: "1.1",
                  margin: 0,
                  letterSpacing: "-1px",
                }}
              >
                {name}
              </h1>
              <span style={{ fontSize: "24px", color: "#f59e0b", fontWeight: "700" }}>
                @{slug}
              </span>
            </div>

            <p
              style={{
                fontSize: "22px",
                color: "#a1a1aa",
                lineHeight: "1.4",
                margin: 0,
                maxWidth: "960px",
              }}
            >
              {bio}
            </p>
          </div>

          {/* Bottom Statistics & Tech Badges */}
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
            {/* Metric counters */}
            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b" }}>
                  {publishedCount}
                </span>
                <span style={{ fontSize: "14px", color: "#71717a", fontWeight: "600", textTransform: "uppercase" }}>
                  Projects
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#10b981" }}>
                  {totalKudos}
                </span>
                <span style={{ fontSize: "14px", color: "#71717a", fontWeight: "600", textTransform: "uppercase" }}>
                  Kudos
                </span>
              </div>
            </div>

            {/* Top Technology Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {topTechs.map((tech) => (
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
    return new Response(`Failed to generate OpenGraph image: ${err.message}`, {
      status: 500,
    });
  }
}
