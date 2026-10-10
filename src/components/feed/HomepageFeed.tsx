"use client";

import React, { useState, useMemo, Suspense } from "react";
import { ProjectCard, ProjectCardData } from "@/components/cards/ProjectCard";
import { useCategoryFilter } from "@/components/providers/CategoryFilterProvider";

export const INITIAL_SHOWCASE_PROJECTS: ProjectCardData[] = [
  {
    id: "proj-1",
    slug: "showphan-platform",
    title: "Showphan: A platform for you",
    summary:
      "It is the best platform to showcase developer projects, discover real high-velocity engineering, and connect with peer builders.",
    statusBadge: { text: "Live Demo", variant: "amber" },
    publishedAt: "2h ago",
    liveUrl: "https://showphan.vercel.app",
    repoUrl: "https://github.com/rajairfanahmed/showphan",
    codeSnippet: `<Showphan showcase={maker}>\n  <Platform stack={['Next15',\n  'Tailwind']}/>`,
    upvotesCount: 342,
    commentsCount: 28,
    bookmarksCount: 1800,
    viewsCount: 4200,
    reactionsCounts: { mindblown: 14, cleancode: 9, greatui: 24, blazingfast: 8, loved: 19, hot: 32 },
    user: {
      name: "Irfan Maulana",
      displayName: "Irfan Maulana",
      slug: "irfan",
      badge: "Pro Maker",
    },
    technologies: [
      { name: "Next.js", slug: "nextjs" },
      { name: "React", slug: "react" },
      { name: "Tailwind", slug: "tailwind" },
      { name: "TypeScript", slug: "typescript" },
    ],
  },
  {
    id: "proj-2",
    slug: "promptforge-ai-workflow-builder",
    title: "PromptForge: AI Workflow Builder",
    summary:
      "Visual node based canvas to compose multi agent LLM pipelines, test prompts with automated eval metrics, and deploy instantly.",
    statusBadge: { text: "v2.4 Released", variant: "emerald" },
    publishedAt: "4h ago",
    liveUrl: "https://promptforge.dev",
    repoUrl: "https://github.com/promptforge/builder",
    codeSnippet: `const pipeline = new AIWorkflow({\n  model: 'gpt-4o'\n})`,
    upvotesCount: 198,
    commentsCount: 14,
    bookmarksCount: 950,
    viewsCount: 2100,
    reactionsCounts: { mindblown: 22, cleancode: 7, greatui: 11, blazingfast: 5, loved: 8, hot: 18 },
    user: {
      name: "Sarah Chen",
      displayName: "Sarah Chen",
      slug: "schen",
      badge: "AI Engineer",
    },
    technologies: [
      { name: "TypeScript", slug: "typescript" },
      { name: "Python", slug: "python" },
      { name: "Docker", slug: "docker" },
    ],
  },
  {
    id: "proj-3",
    slug: "devlens-code-snippet-visualizer",
    title: "DevLens: Code Snippet Visualizer",
    summary:
      "Turn messy code snippets into aesthetic, exportable 4K images with customizable syntax themes, gradients, and custom watermarks.",
    statusBadge: { text: "Trending #1", variant: "blue" },
    publishedAt: "yesterday",
    liveUrl: "https://devlens.app",
    repoUrl: "https://github.com/devlens/app",
    codeSnippet: `git clone devlens-visualizer.git`,
    upvotesCount: 512,
    commentsCount: 42,
    bookmarksCount: 2400,
    viewsCount: 5800,
    reactionsCounts: { mindblown: 31, cleancode: 16, greatui: 45, blazingfast: 12, loved: 29, hot: 41 },
    user: {
      name: "Alex Rivera",
      displayName: "Alex Rivera",
      slug: "alexr",
      badge: "Designer",
    },
    technologies: [
      { name: "React", slug: "react" },
      { name: "Supabase", slug: "supabase" },
      { name: "Tailwind", slug: "tailwind" },
    ],
  },
  {
    id: "proj-4",
    slug: "postgressync-zero-etl-engine",
    title: "PostgresSync: Zero ETL Engine",
    summary:
      "Sync real time tables between PostgreSQL and client states with end to end type safety, optimistic offline cache, and zero latency.",
    statusBadge: { text: "Open Beta", variant: "rose" },
    publishedAt: "2d ago",
    liveUrl: "https://postgressync.io",
    repoUrl: "https://github.com/postgressync/core",
    codeSnippet: `SELECT * FROM schema_realtime;`,
    upvotesCount: 284,
    commentsCount: 19,
    bookmarksCount: 1200,
    viewsCount: 3600,
    reactionsCounts: { mindblown: 19, cleancode: 28, greatui: 6, blazingfast: 34, loved: 12, hot: 15 },
    user: {
      name: "Marcus Brody",
      displayName: "Marcus Brody",
      slug: "marcusb",
      badge: "Core Contributor",
    },
    technologies: [
      { name: "Rust", slug: "rust" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Docker", slug: "docker" },
    ],
  },
  {
    id: "proj-5",
    slug: "hyperui-framer-motion-kit",
    title: "HyperUI: Framer Motion Kit",
    summary:
      "A collection of 60+ micro interactions and animated component primitives tailored specifically for developer facing landing pages.",
    statusBadge: { text: "Components", variant: "cyan" },
    publishedAt: "3d ago",
    liveUrl: "https://hyperui.design",
    repoUrl: "https://github.com/hyperui/kit",
    codeSnippet: `npx shadcn-ui@latest add dock-bar`,
    upvotesCount: 630,
    commentsCount: 35,
    bookmarksCount: 3100,
    viewsCount: 7400,
    reactionsCounts: { mindblown: 40, cleancode: 18, greatui: 62, blazingfast: 15, loved: 38, hot: 55 },
    user: {
      name: "Elena Rostova",
      displayName: "Elena Rostova",
      slug: "elena",
      badge: "Design Technologist",
    },
    technologies: [
      { name: "Framer", slug: "framer" },
      { name: "Tailwind", slug: "tailwind" },
      { name: "React 19", slug: "react" },
    ],
  },
  {
    id: "proj-6",
    slug: "bunflare-edge-microservices",
    title: "Bunflare: Edge Microservices",
    summary:
      "Lightweight starter toolkit for zero cold start edge functions powered by Bun, Cloudflare Workers, and Hono with full OpenAPI typing.",
    statusBadge: { text: "Open Source", variant: "purple" },
    publishedAt: "Oct 08",
    liveUrl: "https://bunflare.dev",
    repoUrl: "https://github.com/bunflare/starter",
    codeSnippet: `> bun test --coverage --bail`,
    upvotesCount: 441,
    commentsCount: 31,
    bookmarksCount: 2000,
    viewsCount: 4900,
    reactionsCounts: { mindblown: 27, cleancode: 21, greatui: 9, blazingfast: 42, loved: 17, hot: 26 },
    user: {
      name: "Kenji Sato",
      displayName: "Kenji Sato",
      slug: "kenji",
      badge: "Infrastructure",
    },
    technologies: [
      { name: "Bun", slug: "bun" },
      { name: "Cloudflare", slug: "cloudflare" },
      { name: "Hono", slug: "hono" },
    ],
  },
];

interface HomepageFeedProps {
  initialProjects?: ProjectCardData[];
}

function HomepageFeedContent({
  initialProjects = INITIAL_SHOWCASE_PROJECTS,
}: HomepageFeedProps) {
  // Instant reactive category state from CategoryFilterProvider (daily.dev style smooth responses)
  const { selectedCategory } = useCategoryFilter();

  // Sort State
  const [sortOption, setSortOption] = useState<"trending" | "upvotes" | "newest" | "views">("trending");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Filter projects smoothly by category and sort
  const sortedProjects = useMemo(() => {
    let list = [...initialProjects];

    // Category filter matching IDs smoothly
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
  }, [initialProjects, selectedCategory, sortOption]);

  const sortLabels = {
    trending: "Trending Today",
    upvotes: "Most Upvoted",
    newest: "Newest Releases",
    views: "Most Viewed",
  };

  return (
    <section className="space-y-5 sm:space-y-6 w-full">
      {/* Feed Controls Header: Sort dropdown + Status count without animated dots */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] font-mono">
          <span>Showing {sortedProjects.length} showcases</span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Sort:</span>
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] hover:bg-[var(--surface-glass)]/80 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer shadow-sm"
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
              className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl py-1 z-30"
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
                      ? "text-amber-500 font-bold bg-[var(--surface-glass)]"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                  }`}
                >
                  <span>{sortLabels[key]}</span>
                  {sortOption === key && <span className="text-amber-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 
        Dynamic Fluid Card Grid:
        - Mobile/Tablet: 1 col (320px - 767px).
        - Desktop with Sidebar: 2 generous columns (~480px-550px each), providing complete breathing room
          so title, launch bar, and bottom action bar fit with zero wrapping or clipping!
        - Ultra-wide or with collapsed sidebar (≥1600px): 3 columns.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-[1600px]:grid-cols-3 gap-5 xl:gap-7 transition-[grid-template-columns] duration-300">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
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
