"use client";

import React, { useState } from "react";

interface LaunchBarProps {
  liveUrl?: string | null;
  repoUrl?: string | null;
  title: string;
}

export function LaunchBar({ liveUrl, repoUrl, title }: LaunchBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <>
      {/* 1. Desktop & In-Page Launch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="ugc nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0052ff] hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer min-touch"
            >
              <span>🌐 Live Site</span>
              <span className="text-xs">↗</span>
            </a>
          )}

          {repoUrl ? (
            <a
              href={repoUrl}
              target="_blank"
              rel="ugc nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[var(--border)] bg-white dark:bg-white/90 hover:bg-slate-50 active:scale-98 text-[#0c0d12] font-semibold text-sm shadow-sm transition-all cursor-pointer min-touch"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Source Code</span>
              <span className="text-xs text-[var(--foreground-muted)]">↗</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] text-xs font-mono">
              <span>🔒 Source code is private</span>
            </span>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[var(--border)] bg-white hover:bg-slate-50 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
            title="Copy showcase link"
          >
            <span>{copied ? "✓ Copied!" : "🔗 Share"}</span>
          </button>
        </div>
      </div>

      {/* 2. Mobile-Only Sticky Floating Launch Bar (< 768px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 bg-white/95 backdrop-blur-xl border-t border-[var(--border)] shadow-2xl flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#0c0d12] truncate">{title}</p>
          <p className="text-[10px] text-[#555a6d] font-mono">Verified Developer Showcase</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="ugc nofollow noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0052ff] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Live Site</span>
              <span>↗</span>
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="ugc nofollow noopener noreferrer"
              className="p-2 rounded-xl border border-[var(--border)] bg-white text-[#0c0d12] text-xs font-bold active:scale-95 transition-all"
              title="View repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
