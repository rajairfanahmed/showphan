import { cookies } from "next/headers";
import { HomepageShell } from "@/components/feed/HomepageShell";
import { getExploreProjects } from "@/lib/projects/explore";
import { getCoverImageUrl } from "@/lib/storage/urls";
import type { ProjectCardData } from "@/components/cards/ProjectCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Showphan: Community Showcase and Developer Discovery Feed",
  description:
    "Discover trending developer showcases, interactive sandboxes, verified engineering proofs, and high impact software projects.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const initialCollapsed = cookieStore.get("showphan-sidebar-collapsed")?.value === "true";

  let projects: ProjectCardData[] = [];

  // Attempt to load real projects whenever database is reachable
  const isDbConfigured =
    Boolean(process.env.DATABASE_URL) &&
    !process.env.DATABASE_URL?.includes("placeholder");

  if (isDbConfigured) {
    try {
      const { projects: dbProjects } = await getExploreProjects({
        tab: "trending",
        limit: 24,
      });

      if (dbProjects && dbProjects.length > 0) {
        projects = dbProjects.map((p) => {
          const coverUrl = getCoverImageUrl(p.coverImageKey ?? undefined);

          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            summary: p.summary || "Developer showcase project.",
            coverImageUrl: coverUrl,
            statusBadge: { text: "Verified", variant: "blue" as const },
            liveUrl: p.liveUrl || null,
            repoUrl: p.repoUrl || null,
            sandboxUrl: (p as { sandboxUrl?: string | null }).sandboxUrl || null,
            sandboxEnabled: Boolean(p.sandboxEnabled),
            upvotesCount: p.kudosCount || 0,
            viewsCount: p.viewsCount || 0,
            commentsCount: 0,
            bookmarksCount: 0,
            publishedAt: new Date(p.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            user: {
              name: p.user.displayName || p.user.name || "Developer",
              displayName: p.user.displayName || p.user.name || "Developer",
              slug: p.user.slug || "dev",
              avatarUrl: p.user.avatarUrl || null,
            },
            technologies:
              p.technologies && p.technologies.length > 0
                ? p.technologies.map((t) => ({
                    name: t.technology.name,
                    slug: t.technology.slug,
                    iconColor: t.technology.iconColor,
                  }))
                : [],
          };
        });
      }
    } catch (err) {
      console.error("Failed to load real explore projects:", err);
    }
  }

  return <HomepageShell initialProjects={projects} initialCollapsed={initialCollapsed} />;
}
