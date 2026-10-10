import { HomepageShell } from "@/components/feed/HomepageShell";
import { INITIAL_SHOWCASE_PROJECTS } from "@/components/feed/HomepageFeed";
import { getExploreProjects } from "@/lib/projects/explore";
import { getCoverImageUrl } from "@/lib/storage/urls";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Showphan: Community Showcase and Developer Discovery Feed",
  description:
    "Discover trending developer showcases, interactive sandboxes, verified engineering proofs, and high impact software projects.",
};

export default async function HomePage() {
  let projects = INITIAL_SHOWCASE_PROJECTS;

  // Attempt to load real projects whenever database is reachable, with zero-delay fallback
  const isDbConfigured = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  if (isDbConfigured) {
    try {
      const { projects: dbProjects } = await getExploreProjects({
        tab: "trending",
        limit: 24,
      });

      if (dbProjects && dbProjects.length > 0) {
        const mapped = dbProjects.map((p, index) => {
          const coverUrl = getCoverImageUrl(p.coverImageKey ?? undefined);
          const fallbackProject = INITIAL_SHOWCASE_PROJECTS[index % INITIAL_SHOWCASE_PROJECTS.length];

          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            summary: p.summary || fallbackProject.summary,
            coverImageUrl: coverUrl || fallbackProject.coverImageUrl,
            codeSnippet: fallbackProject.codeSnippet,
            statusBadge: { text: "Verified", variant: "blue" as const },
            liveUrl: p.liveUrl || fallbackProject.liveUrl,
            repoUrl: p.repoUrl || fallbackProject.repoUrl,
            upvotesCount: p.kudosCount || 0,
            commentsCount: fallbackProject.commentsCount,
            bookmarksCount: fallbackProject.bookmarksCount,
            viewsCount: p.viewsCount || 0,
            reactionsCounts: fallbackProject.reactionsCounts,
            user: {
              name: p.user.name || fallbackProject.user.name,
              displayName: p.user.displayName || fallbackProject.user.displayName,
              slug: p.user.slug || fallbackProject.user.slug,
              avatarUrl: p.user.avatarUrl || fallbackProject.user.avatarUrl,
              badge: fallbackProject.user.badge,
            },
            technologies:
              p.technologies && p.technologies.length > 0
                ? p.technologies.map((t) => ({
                    name: t.technology.name,
                    slug: t.technology.slug,
                    iconColor: t.technology.iconColor,
                  }))
                : fallbackProject.technologies,
          };
        });

        // Prepend real projects to community feed
        const realIds = new Set(mapped.map((m) => m.id));
        const remainingFallbacks = INITIAL_SHOWCASE_PROJECTS.filter((ip) => !realIds.has(ip.id));
        projects = [...mapped, ...remainingFallbacks];
      }
    } catch {
      // Graceful fallback to initial projects
    }
  }

  return <HomepageShell initialProjects={projects} />;
}
