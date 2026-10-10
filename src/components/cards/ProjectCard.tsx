"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VoteControl } from "./VoteControl";
import { ReactionPopover } from "./ReactionPopover";

export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageKey?: string | null;
  coverImageUrl?: string | null;
  codeSnippet?: string | null;
  statusBadge?: {
    text: string;
    variant?: "amber" | "emerald" | "blue" | "rose" | "cyan" | "purple";
  };
  publishedAt?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  upvotesCount?: number;
  commentsCount?: number;
  bookmarksCount?: number;
  viewsCount?: number;
  reactionsCounts?: Record<string, number>;
  user: {
    name?: string | null;
    displayName?: string | null;
    slug: string;
    avatarUrl?: string | null;
    badge?: string | null;
  };
  technologies?: Array<{
    name: string;
    slug: string;
    iconColor?: string | null;
  }>;
}

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(project.bookmarksCount || 18);
  const [copied, setCopied] = useState(false);

  const user = project.user;
  const projectHref = `/${user.slug}/${project.slug}`;

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => (bookmarked ? prev - 1 : prev + 1));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${projectHref}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatMetric = (val?: number | null) => {
    if (!val && val !== 0) return "0";
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}m`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return String(val);
  };

  // Badge styles with high contrast for Day and Night modes (Awwwards Klein Cobalt system)
  const getBadgeStyle = (variant = "blue") => {
    switch (variant) {
      case "emerald":
        return "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "rose":
        return "text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-500/10";
      case "cyan":
        return "text-cyan-700 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "purple":
        return "text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/10";
      case "blue":
      default:
        return "text-[#0052ff] dark:text-blue-400 border-blue-500/30 bg-blue-500/10";
    }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/40 transition-all duration-300 overflow-hidden w-full @container card-container awwwards-card">
      {/* 
        1. 16:9 Cover Image / Visual Preview Area:
        Awwwards Pristine Media: completely unobstructed, zero text or badge overlays on image.
      */}
      <Link href={projectHref} className="block relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-[var(--border)]">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 bg-grid-pattern relative">
            <div className="w-full max-w-xs h-24 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center p-4 shadow-xl">
              <svg className="w-8 h-8 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
        )}
      </Link>

      {/* 
        2. Card Content & Meta Header:
        Mobile-first padding starting from 320px (p-3.5 sm:p-4.5 xl:p-5).
        Launch bar placed below image per award-winning UX patterns.
      */}
      <div className="p-3.5 sm:p-4.5 xl:p-5 flex-1 flex flex-col justify-between gap-4 sm:gap-5">
        <div className="space-y-3 sm:space-y-4">
          {/* Metadata Launch Row: Attribution on Left + Status Badge & Visit App on Right */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Creator Attribution & Published Date */}
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--foreground-muted)] truncate min-w-0">
              <span className="shrink-0">by</span>
              <Link
                href={`/${user.slug}`}
                className="font-medium text-[var(--foreground)] hover:text-[#0052ff] transition-colors truncate underline decoration-transparent hover:decoration-current"
              >
                @{user.slug}
              </Link>
              {project.publishedAt && (
                <span className="text-[var(--foreground-muted)] opacity-75 shrink-0 whitespace-nowrap">
                  • {project.publishedAt}
                </span>
              )}
            </div>

            {/* Status Badge + Visit App Button cleanly pinned together on the right */}
            <div className="inline-flex items-center gap-1.5 shrink-0">
              {project.statusBadge && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${getBadgeStyle(
                    project.statusBadge.variant
                  )}`}
                >
                  <span>{project.statusBadge.text}</span>
                </span>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[var(--foreground)] hover:text-[#0052ff] dark:hover:text-blue-400 bg-[var(--surface-glass)] hover:bg-blue-500/10 border border-[var(--border)] hover:border-blue-500/40 transition-colors cursor-pointer whitespace-nowrap"
                  title="Visit live application"
                >
                  <span>Visit App</span>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Project Title (Generous 2-line title support) */}
          <Link href={projectHref} className="block group/title">
            <h3 className="font-extrabold text-lg sm:text-xl text-[var(--foreground)] group-hover/title:text-[#0052ff] transition-colors tracking-tight line-clamp-2 leading-snug">
              {project.title}
            </h3>
          </Link>

          {/* Project Summary */}
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Technology Badges without dot icons */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech.slug}
                  className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-medium border border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)]"
                >
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Card Footer Action Bar */}
        <div className="pt-3 sm:pt-4 border-t border-[var(--border)] flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left Actions: Upvote & Reactions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Upvote / Downvote */}
            <VoteControl
              projectId={project.id}
              initialVoteCount={project.upvotesCount || 342}
            />

            {/* Reactions Popover */}
            <ReactionPopover
              projectId={project.id}
              initialCounts={project.reactionsCounts}
            />
          </div>

          {/* Right Actions: Comments, Bookmark, Views, Share */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[var(--foreground-muted)] shrink-0">
            {/* Comment icon */}
            <Link
              href={projectHref}
              className="inline-flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="View comments"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-mono">{formatMetric(project.commentsCount || 28)}</span>
            </Link>

            {/* Bookmark icon */}
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`inline-flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg transition-colors cursor-pointer ${
                bookmarked
                  ? "text-[#0052ff] bg-blue-500/10 font-bold"
                  : "hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)]"
              }`}
              title={bookmarked ? "Remove bookmark" : "Save bookmark"}
              aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            >
              <svg
                className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : "fill-none"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="font-mono">{formatMetric(bookmarkCount)}</span>
            </button>

            {/* View count (cleanly hides in compact cards <= 370px, visible on wide cards) */}
            <div className="card-views-metric hidden @[370px]:inline-flex items-center gap-1 px-1 py-1" title="Views">
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-mono">{project.viewsCount ? formatMetric(project.viewsCount) : "4.2k"}</span>
            </div>

            {/* Share icon */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)] transition-colors cursor-pointer relative shrink-0"
              title="Share project"
              aria-label="Share project"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied && (
                <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-[#0052ff] text-white text-[10px] font-bold shadow-md animate-fade-in whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
