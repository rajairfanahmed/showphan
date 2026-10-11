"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ProjectCard, ProjectCardData } from "@/components/cards/ProjectCard";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { CATALOG_TECHNOLOGIES } from "@/lib/catalog/technologies";
import type { DetailedBookmarkItem } from "@/lib/projects/bookmark";

interface InspirationVaultClientProps {
  initialBookmarks: DetailedBookmarkItem[];
}

// Category grouping mapper for developer stacks
function mapTechToVaultCategory(techSlug: string): string {
  const item = CATALOG_TECHNOLOGIES.find(
    (t) => t.slug === techSlug || t.id === techSlug
  );
  if (!item) return "Other";
  if (item.category === "Frontend") return "Frontend";
  if (
    item.category === "Backend" ||
    item.category === "Databases" ||
    item.category === "Cloud & DevOps"
  ) {
    return "Backend & Cloud";
  }
  if (item.category === "AI & Data") return "AI & Data";
  if (item.category === "Languages") return "Languages";
  if (item.category === "Mobile & Desktop") return "Mobile & Systems";
  return "Other";
}

export function InspirationVaultClient({
  initialBookmarks,
}: InspirationVaultClientProps) {
  const [items, setItems] = useState<DetailedBookmarkItem[]>(initialBookmarks);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recent" | "kudos">("recent");

  // Undo Buffer State
  const [undoItem, setUndoItem] = useState<{
    item: DetailedBookmarkItem;
    index: number;
  } | null>(null);
  const [undoProgress, setUndoProgress] = useState<number>(100);
  const [notification, setNotification] = useState<string | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const undoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup undo timers on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, []);

  // Compute available dynamic category tabs from bookmarked projects
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };

    items.forEach((item) => {
      const seenCategories = new Set<string>();
      item.project.technologies.forEach((tech) => {
        const cat = mapTechToVaultCategory(tech.slug);
        if (cat !== "Other" && !seenCategories.has(cat)) {
          seenCategories.add(cat);
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
    });

    return counts;
  }, [items]);

  const availableCategories = useMemo(() => {
    const categories = ["All"];
    const priority = [
      "Frontend",
      "Backend & Cloud",
      "AI & Data",
      "Languages",
      "Mobile & Systems",
    ];

    priority.forEach((cat) => {
      if (categoryCounts[cat] && categoryCounts[cat] > 0) {
        categories.push(cat);
      }
    });

    return categories;
  }, [categoryCounts]);

  // Filter & Sort
  const filteredAndSortedItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items
      .filter((item) => {
        // Category filter
        if (activeCategory !== "All") {
          const hasCategory = item.project.technologies.some(
            (t) => mapTechToVaultCategory(t.slug) === activeCategory
          );
          if (!hasCategory) return false;
        }

        // Text query filter
        if (!q) return true;

        const matchTitle = item.project.title.toLowerCase().includes(q);
        const matchSummary = item.project.summary.toLowerCase().includes(q);
        const matchAuthor =
          item.project.user.slug.toLowerCase().includes(q) ||
          (item.project.user.displayName?.toLowerCase().includes(q) ?? false) ||
          (item.project.user.name?.toLowerCase().includes(q) ?? false);
        const matchTags = item.project.tags.some((t) =>
          t.toLowerCase().includes(q)
        );
        const matchTech = item.project.technologies.some(
          (t) =>
            t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
        );

        return (
          matchTitle || matchSummary || matchAuthor || matchTags || matchTech
        );
      })
      .sort((a, b) => {
        if (sortBy === "kudos") {
          return b.project.kudosCount - a.project.kudosCount;
        }
        // "recent" by bookmark timestamp
        return (
          new Date(b.bookmarkedAt).getTime() -
          new Date(a.bookmarkedAt).getTime()
        );
      });
  }, [items, search, activeCategory, sortBy]);

  // Handle Optimistic Unbookmarking with 5-Second Undo Toast
  const handleUnbookmark = (projectId: string) => {
    const targetIdx = items.findIndex((it) => it.project.id === projectId);
    if (targetIdx === -1) return;

    const removedItem = items[targetIdx];

    // Optimistically remove from list
    setItems((prev) => prev.filter((it) => it.project.id !== projectId));

    // Clear previous undo timers if active
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);

    setUndoItem({ item: removedItem, index: targetIdx });
    setUndoProgress(100);

    // Call server DELETE
    fetch(`/api/projects/${projectId}/bookmark`, { method: "DELETE" }).catch(
      () => {}
    );

    // Smooth 5-second progress countdown
    const duration = 5000;
    const intervalMs = 50;
    const step = 100 / (duration / intervalMs);
    let currentProgress = 100;

    undoIntervalRef.current = setInterval(() => {
      currentProgress = Math.max(0, currentProgress - step);
      setUndoProgress(currentProgress);
      if (currentProgress <= 0 && undoIntervalRef.current) {
        clearInterval(undoIntervalRef.current);
      }
    }, intervalMs);

    undoTimerRef.current = setTimeout(() => {
      setUndoItem(null);
    }, duration);
  };

  // Handle Undo
  const handleUndo = () => {
    if (!undoItem) return;

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);

    const { item, index } = undoItem;

    // Re-insert at original index
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 0, item);
      return next;
    });

    setUndoItem(null);
    setNotification(`Restored "${item.project.title}" to Inspiration Vault.`);
    setTimeout(() => setNotification(null), 3000);

    // Re-bookmark on server
    fetch(`/api/projects/${item.project.id}/bookmark`, {
      method: "POST",
    }).catch(() => {});
  };

  // Convert DetailedBookmarkItem to ProjectCardData
  const toCardData = (item: DetailedBookmarkItem): ProjectCardData => ({
    id: item.project.id,
    slug: item.project.slug,
    title: item.project.title,
    summary: item.project.summary,
    coverImageUrl: getCoverImageUrl(item.project.coverImageKey),
    liveUrl: item.project.liveUrl,
    repoUrl: item.project.repoUrl,
    upvotesCount: item.project.kudosCount,
    viewsCount: item.project.viewsCount,
    bookmarksCount: item.project.bookmarksCount,
    hasGivenKudos: item.hasGivenKudos,
    hasBookmarked: true,
    publishedAt: "Saved",
    statusBadge: { text: "Published", variant: "emerald" },
    user: item.project.user,
    technologies: item.project.technologies,
  });

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* 1. Header Banner */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--card)]/60 via-[var(--background)] to-[var(--background)] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
            <Link
              href="/dashboard"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#0052ff] dark:text-blue-400 font-semibold">
              Inspiration Vault
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0052ff] dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                  Inspiration Vault
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 bg-blue-500/10 text-[#0052ff] dark:text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff] animate-pulse" />
                  {items.length} Saved {items.length === 1 ? "Project" : "Projects"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
                Your private collection of inspiring developer showcases, architecture patterns, and UI proofs-of-work.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <span>Discover More Showcases</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls Bar: Dynamic Category Tabs, Live Search, Sort */}
      <section className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Dynamic Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {availableCategories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20 font-bold"
                        : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-blue-500/30"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--surface-glass)] text-[var(--foreground-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Selector */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Real-time search */}
              <div className="relative flex-1 sm:w-64">
                <svg
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, tag, or tech..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs font-bold cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Toggle */}
              <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy("recent")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    sortBy === "recent"
                      ? "bg-[#0052ff] text-white shadow-sm"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                  title="Sort by recently saved"
                >
                  Recent
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("kudos")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    sortBy === "kudos"
                      ? "bg-[#0052ff] text-white shadow-sm"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                  title="Sort by most kudos"
                >
                  Top Kudos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Fluid Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        {items.length === 0 ? (
          /* Empty Vault State */
          <div className="text-center py-24 border border-dashed border-[var(--border)] rounded-3xl p-8 sm:p-12 space-y-5 bg-[var(--card)]/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-[#0052ff] dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
              <svg
                className="w-8 h-8 fill-current"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="font-extrabold text-xl sm:text-2xl text-[var(--foreground)]">
                Your Inspiration Vault is empty
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                As you explore the Showcase Directory, click the bookmark icon on any card to curate your personal vault of architectures and ideas.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052ff] text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <span>Browse Showcase Directory</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          /* Zero Search Results State */
          <div className="text-center py-20 border border-[var(--border)] rounded-2xl p-8 space-y-4 bg-[var(--card)]/40">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0052ff] flex items-center justify-center mx-auto text-base">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[var(--foreground)]">
                No matching saved projects found
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto">
                No saved projects match &quot;{search}&quot; in the &quot;{activeCategory}&quot; category.
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="px-4 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--foreground)] hover:border-[#0052ff] transition-all cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          /* Dynamic Fluid Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item) => (
              <div key={item.bookmarkId} className="relative group/wrapper">
                <ProjectCard
                  project={toCardData(item)}
                  initialBookmarked={true}
                  onBookmarkToggle={(_id, nowBookmarked) => {
                    if (!nowBookmarked) {
                      handleUnbookmark(item.project.id);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Floating Undo Toast Buffer */}
      {undoItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl shadow-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--foreground)] truncate">
                    Removed from Inspiration Vault
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)] truncate">
                    {undoItem.item.project.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => setUndoItem(null)}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs font-bold p-1 cursor-pointer"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0052ff] transition-all duration-75 ease-linear"
                style={{ width: `${undoProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Notification Confirmation Toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
