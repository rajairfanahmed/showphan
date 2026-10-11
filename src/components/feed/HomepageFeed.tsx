"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { ProjectCard, ProjectCardData } from "@/components/cards/ProjectCard";
import { useCategoryFilter } from "@/components/providers/CategoryFilterProvider";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { HomepageHero } from "./HomepageHero";

interface HomepageFeedProps {
  initialProjects?: ProjectCardData[];
}

function HomepageFeedContent({
  initialProjects = [],
}: HomepageFeedProps) {
  // Real projects state initialized with real server projects (or empty array)
  const [feedProjects, setFeedProjects] = useState<ProjectCardData[]>(initialProjects);

  // Client-side dynamic refresh from real database explore API
  React.useEffect(() => {
    let isMounted = true;
    async function fetchLatestProjects() {
      try {
        const res = await fetch("/api/explore?tab=trending");
        if (!res.ok) return;
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects) && isMounted) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: ProjectCardData[] = data.projects.map((p: any) => {
            const coverUrl = getCoverImageUrl(p.coverImageKey);

            return {
              id: p.id,
              slug: p.slug,
              title: p.title,
              summary: p.summary || "Developer showcase project.",
              coverImageUrl: coverUrl,
              publishedAt: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Just now",
              liveUrl: p.liveUrl || null,
              repoUrl: p.repoUrl || null,
              upvotesCount: p.kudosCount || 0,
              viewsCount: p.viewsCount || 0,
              commentsCount: p._count?.comments || 0,
              bookmarksCount: p._count?.bookmarks || 0,
              statusBadge: { text: "Verified", variant: "blue" as const },
              user: {
                name: p.user?.displayName || p.user?.name || "Developer",
                displayName: p.user?.displayName || p.user?.name || "Developer",
                slug: p.user?.slug || "dev",
                avatarUrl: p.user?.avatarUrl || null,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              technologies: (p.technologies || []).map((t: any) => ({
                name: t.technology?.name || t.name,
                slug: t.technology?.slug || t.slug,
              })),
            };
          });

          setFeedProjects(mapped);
        }
      } catch {
        // Keep existing loaded feed
      }
    }
    fetchLatestProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Instant reactive category state from CategoryFilterProvider
  const { selectedCategory } = useCategoryFilter();

  // Sort State
  const [sortOption, setSortOption] = useState<"trending" | "upvotes" | "newest" | "views">("trending");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Filter projects smoothly by category and sort
  const sortedProjects = useMemo(() => {
    let list = [...feedProjects];

    // Category filter matching
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => {
        if (selectedCategory === "nextjs") {
          return p.technologies?.some((t) => t.slug === "nextjs");
        }
        if (selectedCategory === "ai_ml" || selectedCategory === "ai-ml") {
          return (
            p.technologies?.some((t) => t.slug === "python" || t.slug === "docker") ||
            p.title.toLowerCase().includes("ai") ||
            p.summary.toLowerCase().includes("ai")
          );
        }
        if (selectedCategory === "devtools" || selectedCategory === "dev-tools") {
          return p.technologies?.some((t) => t.slug === "docker" || t.slug === "rust" || t.slug === "bun");
        }
        if (selectedCategory === "opensource" || selectedCategory === "open-source") {
          return p.statusBadge?.text.toLowerCase().includes("open") || Boolean(p.repoUrl);
        }
        return true;
      });
    }

    // Sort order
    switch (sortOption) {
      case "upvotes":
        return list.sort((a, b) => (b.upvotesCount || 0) - (a.upvotesCount || 0));
      case "views":
        return list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      case "newest":
        return [...list].reverse();
      case "trending":
      default:
        return list;
    }
  }, [feedProjects, selectedCategory, sortOption]);

  const sortLabels = {
    trending: "Trending Today",
    upvotes: "Most Upvoted",
    newest: "Newest Releases",
    views: "Most Viewed",
  };

  return (
    <section className="space-y-6 w-full">
      {/* 1. Top Restrained Discovery Hero Banner */}
      <HomepageHero />

      {/* 2. Feed Controls Header: Sort dropdown + Status count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--foreground)]">Community Feed</span>
          <span className="text-[11px] text-[var(--foreground-muted)] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {sortedProjects.length} showcases
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Sort by:</span>
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] hover:bg-[var(--surface-glass)]/80 text-xs font-semibold text-[var(--foreground)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              aria-label="Sort showcases"
            >
              <span>{sortLabels[sortOption]}</span>
              <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {sortDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl py-1 z-30 animate-fade-in"
              onMouseLeave={() => setSortDropdownOpen(false)}
            >
              {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSortOption(key);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    sortOption === key
                      ? "text-[#0052ff] font-bold bg-blue-50/50 dark:bg-zinc-800/80"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                  }`}
                >
                  <span>{sortLabels[key]}</span>
                  {sortOption === key && <span className="text-[#0052ff] font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 
        3. Awwwards Intrinsic Fluid Card Grid / Empty State:
        - Mobile: 1 fluid column (320px - 639px).
        - Tablet/Desktop: Container-aware repeat(auto-fill, minmax(360px, 1fr)).
      */}
      {sortedProjects.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 sm:p-14 text-center shadow-xs max-w-xl mx-auto my-6 space-y-5">
          {/* Architectural SVG Emblem (Replacing raw emojis per design-taste Section 3.D) */}
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-[#0052ff] dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20 shadow-xs">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
              Be the first to showcase your project
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-md mx-auto">
              Showphan is live! Share your work with fellow engineers, gather kudos, and discover high-impact engineering builds.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>+ Submit First Project</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="awwwards-fluid-grid transition-all duration-300">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

export function HomepageFeed(props: HomepageFeedProps) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-[var(--foreground-muted)] font-mono text-xs">Loading showcase feed...</div>}>
      <HomepageFeedContent {...props} />
    </Suspense>
  );
}
