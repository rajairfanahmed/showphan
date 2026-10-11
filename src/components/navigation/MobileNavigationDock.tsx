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
        <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-900/10">
          {/* 1. Home / Feed */}
          <Link
            href="/"
            aria-label="Community Feed"
            className={`p-2 sm:p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname === "/"
                ? "bg-blue-50 text-[#0052ff] font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
            className="p-2 sm:p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center min-touch"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* 3. Explore / Trending */}
          <Link
            href="/explore"
            aria-label="Explore Showcases"
            className={`p-2 sm:p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname.startsWith("/explore")
                ? "bg-blue-50 text-[#0052ff] font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
            className={`p-2 sm:p-2.5 rounded-full transition-colors relative flex items-center justify-center cursor-pointer min-touch ${
              pathname.includes("/bookmarks")
                ? "bg-blue-50 text-[#0052ff] font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>

          {/* Divider */}
          <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

          {/* 5. Submit Project (+) Prominent Cobalt Button */}
          <Link
            href="/dashboard/new"
            aria-label="Submit Project"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0052ff] hover:bg-blue-600 text-white font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span className="text-lg sm:text-xl leading-none font-bold">+</span>
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
