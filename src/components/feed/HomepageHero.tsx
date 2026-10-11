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
      className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3.5 min-[360px]:p-5 sm:p-8 overflow-hidden shadow-xs transition-all duration-300"
    >
      {/* Background Architectural Grid Pattern (Electric Cobalt at 0.65px) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#0052ff 0.65px, transparent 0.65px), radial-gradient(#0052ff 0.65px, transparent 0.65px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Top Right Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        title="Dismiss announcement"
        aria-label="Dismiss hero banner"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* Left Column: Stack of Max 4 Text Elements (Eyebrow, Headline, Subtext, CTAs) */}
        <div className="max-w-2xl space-y-2.5 sm:space-y-3">
          {/* 1. Restrained Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[#0052ff] bg-blue-50 border border-blue-200/70 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff] animate-pulse" />
            <span>Developer Discovery Feed</span>
          </div>

          {/* 2. Headline (Max 2 lines, tight tracking) */}
          <h1 className="text-xl min-[360px]:text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Where developers showcase what is next.
          </h1>

          {/* 3. Subtext (Strictly 16 words, under the 20-word cap) */}
          <p className="text-xs min-[360px]:text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Discover trending software builds, inspect interactive sandboxes, and gather real kudos from fellow creators.
          </p>

          {/* 4. Action Buttons (Mobile-first stack down to 320px) */}
          <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 pt-1 sm:pt-2">
            <Link
              href="/dashboard/new"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Share Your Build</span>
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Explore Tech Stacks</span>
              <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mobile Telemetry Micro-Strip (< 1024px) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 lg:hidden">
            <div className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-500">Catalog</span>
              <span className="text-[11px] font-mono font-bold text-slate-900">700+ Badges</span>
            </div>
            <div className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-500">Telemetry</span>
              <span className="text-[11px] font-mono font-bold text-[#0052ff]">100% Kudos</span>
            </div>
            <div className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-500">Previews</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">Responsive</span>
            </div>
          </div>
        </div>

        {/* Right Column: Desktop Architectural Telemetry Indicators (>= 1024px) */}
        <div className="hidden lg:flex flex-col gap-2.5 shrink-0 min-w-[240px]">
          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">Verified Catalog</span>
            <span className="text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200/60 px-2 py-0.5 rounded-md">
              700+ Badges
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">Live Metrics</span>
            <span className="text-xs font-mono font-bold text-[#0052ff] bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
              100% Real Kudos
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">Sandbox Previews</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              Responsive
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
