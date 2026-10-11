"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const emptySubscribe = () => () => {};

function getDismissedSnapshot(): boolean {
  try {
    return localStorage.getItem("showphan-hero-dismissed") === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function HomepageHero() {
  const isStoredDismissed = useSyncExternalStore(
    emptySubscribe,
    getDismissedSnapshot,
    getServerSnapshot
  );
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleDismiss = () => {
    setManuallyDismissed(true);
    try {
      localStorage.setItem("showphan-hero-dismissed", "true");
    } catch {}
  };

  if (isStoredDismissed || manuallyDismissed) {
    return null;
  }

  return (
    <section
      aria-label="Platform Introduction"
      className="relative w-full rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/60 dark:to-blue-950/20 p-6 sm:p-8 overflow-hidden shadow-sm transition-all duration-300"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#0052ff 0.75px, transparent 0.75px), radial-gradient(#0052ff 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
      />

      {/* Top Right Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer z-10"
        title="Dismiss announcement"
        aria-label="Dismiss hero banner"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Stack of Max 4 Text Elements (Eyebrow, Headline, Subtext, CTAs) */}
        <div className="max-w-2xl space-y-3">
          {/* 1. Restrained Eyebrow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#0052ff] dark:text-blue-400 bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff] animate-pulse" />
            <span>Developer Discovery Feed</span>
          </div>

          {/* 2. Headline (Max 2 lines) */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight leading-tight">
            Where developers showcase what is next.
          </h1>

          {/* 3. Subtext (Strictly 16 words, under the 20-word cap) */}
          <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed max-w-xl">
            Discover trending software builds, inspect interactive sandboxes, and gather real kudos from fellow creators.
          </p>

          {/* 4. Action Buttons (One primary + One secondary, distinct intent) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Share Your Build</span>
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] hover:bg-[var(--surface-glass)]/80 text-xs sm:text-sm font-semibold text-[var(--foreground)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Explore Tech Stacks</span>
              <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Column: Architectural Telemetry Indicators (Desktop >= 1024px) */}
        <div className="hidden lg:flex flex-col gap-2.5 shrink-0 min-w-[240px]">
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">Verified Catalog</span>
            <span className="text-xs font-mono font-bold text-[var(--foreground)] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              700+ Badges
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">Live Metrics</span>
            <span className="text-xs font-mono font-bold text-[#0052ff] dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
              100% Real Kudos
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">Sandbox Previews</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Responsive
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
