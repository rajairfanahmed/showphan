"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";
import { ReadmeBadgeCard } from "@/components/ReadmeBadgeCard";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageKey: string | null;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  position: number;
  kudosCount: number;
  viewsCount?: number;
  updatedAt: string;
  technologies: Array<{
    technology: {
      id: string;
      name: string;
      slug: string;
      iconColor?: string | null;
    };
  }>;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [copyToast, setCopyToast] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
      return;
    }
    if (session?.user) {
      let isMounted = true;
      fetch("/api/projects")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.projects) {
            setProjects(data.projects);
          }
        })
        .catch((err) => console.error("Failed to load projects", err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [isPending, session, router]);

  const handleToggleFeatured = async (project: ProjectItem) => {
    const currentFeatured = projects.filter((p) => p.isFeatured).length;
    if (!project.isFeatured && currentFeatured >= 6) {
      showToast("Maximum limit of 6 featured showcases reached.");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !project.isFeatured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
        showToast(
          !project.isFeatured
            ? "Pinned to flagship profile shelf!"
            : "Removed from featured shelf."
        );
      }
    } catch {
      showToast("Failed to update featured status.");
    }
  };

  const handleTogglePublish = async (project: ProjectItem) => {
    const isPublishing = project.status !== "PUBLISHED";
    const endpoint = isPublishing
      ? `/api/projects/${project.id}/publish`
      : `/api/projects/${project.id}/unpublish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, status: data.project.status } : p
          )
        );
        showToast(isPublishing ? "Published to discovery feed! 🚀" : "Showcase moved to drafts.");
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.error?.missingRules) {
          showToast(`Publishing blocked: ${err.error.missingRules[0]}`);
        } else {
          showToast(err.error?.message || "Could not update showcase status.");
        }
      }
    } catch {
      showToast("Network error changing status.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/projects/${deleteModalId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteModalId));
        setDeleteModalId(null);
        showToast("Showcase permanently removed.");
      } else {
        showToast("Failed to delete project.");
      }
    } catch {
      showToast("Network error deleting project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProjects(updated);

    try {
      await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: updated.map((p) => p.id) }),
      });
    } catch {
      // Revert if needed
    }
  };

  const userSlug = (session?.user as { slug?: string } | undefined)?.slug || "profile";
  const publicProfileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${userSlug}`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  // Metrics
  const totalKudos = useMemo(
    () => projects.reduce((acc, p) => acc + (p.kudosCount || 0), 0),
    [projects]
  );
  const publishedCount = useMemo(
    () => projects.filter((p) => p.status === "PUBLISHED").length,
    [projects]
  );
  const draftCount = useMemo(
    () => projects.filter((p) => p.status === "DRAFT").length,
    [projects]
  );
  const featuredCount = useMemo(
    () => projects.filter((p) => p.isFeatured).length,
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (activeTab === "PUBLISHED") return projects.filter((p) => p.status === "PUBLISHED");
    if (activeTab === "DRAFT") return projects.filter((p) => p.status === "DRAFT");
    return projects;
  }, [projects, activeTab]);

  if (isPending || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex-1">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0c0d12] text-white text-xs font-bold shadow-2xl border border-white/10 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0052ff] animate-ping" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Daylight Ceramic Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0c0d12] tracking-tight">
            Developer Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
            Manage your engineering showcases, adjust public portfolio priority, and track live kudos.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={copyProfileLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-glass)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <span>{copyToast ? "Copied! ✓" : "Copy Profile Link"}</span>
          </button>
          <Link
            href={`/${userSlug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-glass)] text-xs font-semibold text-[var(--foreground)] transition-colors"
          >
            <span>View Public Profile ↗</span>
          </Link>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <span>+ Add Project</span>
          </Link>
        </div>
      </div>

      {/* 2. Portfolio Traction HUD Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        {/* Metric 1: Capacity Quota */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Quota Limit
            </span>
            <span className="text-xs font-mono font-bold text-[#0052ff]">
              {projects.length} / 30
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0052ff] transition-all duration-500"
              style={{ width: `${Math.min(100, (projects.length / 30) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)]">
            {30 - projects.length} slots remaining
          </p>
        </div>

        {/* Metric 2: Total Real Kudos */}
        <div className="space-y-1 p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
            Community Kudos
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#0c0d12]">★ {totalKudos}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Real Votes</span>
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)]">
            Across all published projects
          </p>
        </div>

        {/* Metric 3: Published Live */}
        <div className="space-y-1 p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
            Published Live
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{publishedCount}</span>
            <span className="text-[11px] text-[var(--foreground-muted)]">Showcases</span>
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)]">
            Live on Discovery Feed
          </p>
        </div>

        {/* Metric 4: Flagship Shelf */}
        <div className="space-y-1 p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Flagship Shelf
            </span>
            <span className="text-[10px] font-mono text-[#0052ff] font-bold">
              {featuredCount}/6
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#0052ff]">{featuredCount}</span>
            <span className="text-[11px] text-[var(--foreground-muted)]">Pinned</span>
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)]">
            Promoted on profile top shelf
          </p>
        </div>
      </div>

      {/* 3. Showcase Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
          }`}
        >
          All Showcases ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PUBLISHED")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "PUBLISHED"
              ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
          }`}
        >
          Published ({publishedCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("DRAFT")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "DRAFT"
              ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
          }`}
        >
          Drafts ({draftCount})
        </button>
      </div>

      {/* 4. Projects Listing or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-3xl bg-[var(--card)] p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052ff] flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
            🚀
          </div>
          <h3 className="font-extrabold text-lg text-[#0c0d12]">
            {activeTab === "ALL" ? "No showcases built yet" : `No showcases in ${activeTab.toLowerCase()}`}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-sm mx-auto leading-relaxed">
            {activeTab === "ALL"
              ? "Publish your first high-impact engineering build with 16:9 media, tech stack icons, and live demo links."
              : `Switch tabs or initialize a new project to start building.`}
          </p>
          {activeTab === "ALL" && (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              + Create Your First Showcase
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project, idx) => {
            const coverUrl = getCoverImageUrl(project.coverImageKey);
            return (
              <div
                key={project.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/40 transition-all gap-4 shadow-sm group"
              >
                {/* Left: Reorder Controls + 16:9 Thumbnail + Information */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Reorder Buttons (Persistent position ordering) */}
                  <div className="flex flex-col gap-1 text-[var(--foreground-muted)] shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-blue-50 hover:text-[#0052ff] disabled:opacity-20 transition-colors cursor-pointer text-xs"
                      title="Move up in portfolio"
                      aria-label="Move up in portfolio"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === filteredProjects.length - 1}
                      className="p-1 rounded hover:bg-blue-50 hover:text-[#0052ff] disabled:opacity-20 transition-colors cursor-pointer text-xs"
                      title="Move down in portfolio"
                      aria-label="Move down in portfolio"
                    >
                      ▼
                    </button>
                  </div>

                  {/* 16:9 Thumbnail */}
                  <div className="w-24 sm:w-28 aspect-video rounded-xl bg-slate-900 border border-[var(--border)] shrink-0 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] text-blue-400 font-mono font-bold">16:9 Media</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/project/${project.id}/edit`}
                        className="font-extrabold text-sm sm:text-base text-[#0c0d12] hover:text-[#0052ff] transition-colors truncate"
                      >
                        {project.title}
                      </Link>

                      {project.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Draft
                        </span>
                      )}

                      {project.kudosCount > 0 && (
                        <span className="text-[10px] font-mono font-bold text-[#0052ff]">
                          ★ {project.kudosCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-1 max-w-xl">
                      {project.summary || "No summary added yet. Click edit to describe your architecture."}
                    </p>

                    {/* Official Tech Stack Badges */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {project.technologies.slice(0, 4).map(({ technology }) => (
                          <TechBadge
                            key={technology.id}
                            name={technology.name}
                            iconName={technology.iconColor || undefined}
                            size="sm"
                          />
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions Row */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                  {/* Flagship Feature Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(project)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      project.isFeatured
                        ? "border-[#0052ff] bg-blue-500/15 text-[#0052ff] shadow-sm"
                        : "border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                    }`}
                    title={
                      !project.isFeatured && featuredCount >= 6
                        ? "Max 6 flagship projects allowed"
                        : "Feature on public developer profile"
                    }
                  >
                    <span>★ {project.isFeatured ? "Featured" : "Feature"}</span>
                  </button>

                  {/* Publish/Unpublish Toggle */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:bg-[var(--surface-glass)] text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    {project.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>

                  {/* Edit Studio */}
                  <Link
                    href={`/dashboard/project/${project.id}/edit`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0052ff] text-white hover:bg-blue-600 shadow-sm transition-all"
                  >
                    Edit Studio
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteModalId(project.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete showcase"
                    aria-label="Delete showcase"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. GitHub Profile README Badge Card */}
      {session?.user && userSlug && (
        <div className="pt-4">
          <ReadmeBadgeCard slug={userSlug} />
        </div>
      )}

      {/* 6. High-Contrast Safe Deletion Confirmation Modal */}
      {deleteModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setDeleteModalId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-[#0c0d12]">
                Permanently delete this showcase?
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                This action cannot be undone. The project record, peer kudos, bookmarks, and its stored 16:9 cover image in Cloudflare R2 will be permanently pruned.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeleting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
