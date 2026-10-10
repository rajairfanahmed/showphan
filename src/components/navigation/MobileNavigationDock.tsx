"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/modals/CommandPalette";

export function MobileNavigationDock() {
  const pathname = usePathname();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <>
      {/* Floating Bottom App Dock (daily.dev style for mobile viewports) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-4 inset-x-0 mx-auto w-max z-50 flex items-center justify-center pointer-events-auto"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full bg-[var(--card)]/90 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/40 ring-1 ring-white/10">
          {/* 1. Home / Feed */}
          <Link
            href="/"
            aria-label="Community Feed"
            className={`p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname === "/"
                ? "bg-blue-500/15 text-[#0052ff] dark:text-blue-400 font-bold"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
            }`}
          >
            <svg className="w-5 h-5" fill={pathname === "/" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

          {/* 2. Search (Command Palette Trigger) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Search showcases"
            className="p-2.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer flex items-center justify-center min-touch"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* 3. Explore / Trending */}
          <Link
            href="/explore"
            aria-label="Explore Showcases"
            className={`p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname.startsWith("/explore")
                ? "bg-blue-500/15 text-[#0052ff] dark:text-blue-400 font-bold"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2.5 5.5-5.5 2.5 2.5-5.5 5.5-2.5z" />
            </svg>
          </Link>

          {/* 4. Bookmarks / Vault */}
          <Link
            href="/dashboard/bookmarks"
            aria-label="Bookmarks"
            className={`p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname.includes("/bookmarks")
                ? "bg-blue-500/15 text-[#0052ff] dark:text-blue-400 font-bold"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>

          {/* Divider */}
          <div className="w-[1px] h-5 bg-[var(--border)] mx-0.5" />

          {/* 5. Submit Project (+) Prominent Cobalt Button */}
          <Link
            href="/dashboard/new"
            aria-label="Submit Project"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="text-xl leading-none">+</span>
          </Link>
        </div>
      </nav>

      {/* Command Palette Modal triggered from dock */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
