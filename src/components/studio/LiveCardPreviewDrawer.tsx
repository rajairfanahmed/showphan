"use client";

import React, { useEffect } from "react";
import { ProjectCard, ProjectCardData } from "@/components/cards/ProjectCard";
import { getCoverImageUrl } from "@/lib/storage/urls";

interface LiveCardPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary: string;
  coverImageKey: string | null;
  technologies: Array<{ name: string; slug: string; iconColor?: string | null }>;
  liveUrl?: string | null;
  repoUrl?: string | null;
  user: {
    displayName?: string | null;
    name?: string | null;
    slug: string;
    avatarUrl?: string | null;
  };
}

export function LiveCardPreviewDrawer({
  isOpen,
  onClose,
  title,
  summary,
  coverImageKey,
  technologies,
  liveUrl,
  repoUrl,
  user,
}: LiveCardPreviewDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const coverUrl = coverImageKey ? getCoverImageUrl(coverImageKey) : null;

  const previewCardData: ProjectCardData = {
    id: "preview-card-temp",
    slug: "preview",
    title: title.trim() || "Untitled Project",
    summary: summary.trim() || "Add a punchy summary to see your card preview update in real-time.",
    coverImageUrl: coverUrl,
    publishedAt: "Just now",
    liveUrl: liveUrl || null,
    repoUrl: repoUrl || null,
    upvotesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    viewsCount: 0,
    reactionsCounts: {},
    statusBadge: { text: "Preview", variant: "blue" },
    user: {
      name: user.displayName || user.name || "Developer",
      displayName: user.displayName || user.name || "Developer",
      slug: user.slug || "dev",
      avatarUrl: user.avatarUrl || null,
      badge: "Maker",
    },
    technologies:
      technologies.length > 0
        ? technologies
        : [{ name: "Next.js", slug: "nextjs", iconColor: "logos:nextjs-icon" }],
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in cursor-pointer select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Live Feed Card Preview"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-6 shadow-2xl space-y-4 cursor-default select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052ff] animate-pulse" />
            <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">
              Live Feed Card Preview
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-[var(--foreground-muted)]">
          Click anywhere outside to dismiss. This is exactly how your showcase will render on the discovery feed:
        </p>

        {/* Live ProjectCard Render */}
        <div className="py-2">
          <ProjectCard project={previewCardData} />
        </div>

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--foreground-muted)] font-mono">
          <span>Unobstructed 16:9 Aspect Ratio</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-glass)] text-[var(--foreground)] font-semibold transition-colors cursor-pointer"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
}
