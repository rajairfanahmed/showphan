"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { WordmarkLogo } from "@/components/WordmarkLogo";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { useCategoryFilter } from "@/components/providers/CategoryFilterProvider";

function TopNavbarContent({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { selectedCategory, setSelectedCategory, categories } = useCategoryFilter();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const userSlug =
    (session?.user as { slug?: string } | undefined)?.slug ||
    session?.user?.name?.toLowerCase().replace(/\s+/g, "") ||
    "profile";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="w-full px-2 min-[360px]:px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Left: Mobile Sidebar Hamburger + Wordmark Logo + Command Search */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}

            {/* Platform Trophy Wordmark Logo */}
            <div className="shrink-0 flex items-center">
              <WordmarkLogo size="md" className="sm:hidden" />
              <WordmarkLogo size="lg" className="hidden sm:flex" />
            </div>

            {/* Desktop Command Palette Search Trigger */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group shadow-xs"
              aria-label="Search developer showcases"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-[#0052ff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-normal">Search dev...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white text-slate-500 text-[10px] font-mono border border-slate-200 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center: Desktop Tags responsive bar */}
          <nav
            className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none"
            aria-label="Filter showcases by category"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#0052ff] text-white font-bold shadow-xs scale-102"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Right: New Count + Submit Project + Mobile Search + Notifications + User Avatar */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Mobile search trigger icon */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="sm:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open search dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 94 new today badge pill (Ceramic Daylight) */}
            <div className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold select-none">
              <span>94 new today</span>
            </div>

            {/* Submit Project Button (Mobile-first down to 320px, Electric Cobalt) */}
            <Link
              href="/dashboard/new"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="text-sm leading-none font-bold">+</span>
              <span className="hidden min-[380px]:inline">Submit</span>
              <span className="hidden sm:inline">Project</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User Profile Avatar with dropdown or Sign In */}
            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center rounded-full ring-2 ring-blue-500/30 hover:ring-[#0052ff] transition-all cursor-pointer"
                  aria-label="User account menu"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-[#0052ff] border border-blue-200 font-bold text-xs flex items-center justify-center">
                      {(session.user.name || "I")[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200/90 bg-white shadow-xl py-1.5 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href={`/${userSlug}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookmarks"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Bookmarks
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-[#0052ff] border border-blue-200 font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/20 hover:bg-[#0052ff] hover:text-white transition-all cursor-pointer"
                title="Sign in with GitHub"
                aria-label="Sign in"
              >
                I
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Category Tags: Scrollable Daylight Pills (320px+) */}
        <div className="md:hidden border-t border-slate-200/70 px-2.5 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 bg-white/95">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#0052ff] text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}

export function TopNavbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <Suspense fallback={<div className="h-14 sm:h-16 w-full bg-[var(--glass-bg)] border-b border-[var(--border)]" />}>
      <TopNavbarContent onToggleSidebar={onToggleSidebar} />
    </Suspense>
  );
}
