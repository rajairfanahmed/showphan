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
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl">
        <div className="w-full px-2.5 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          {/* Left: Mobile Sidebar Hamburger + Big Trophy Logo + Command Search */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}

            {/* Clearly Big Trophy Logo (Platform Icon, no text) */}
            <div className="shrink-0 flex items-center">
              <WordmarkLogo size="lg" />
            </div>

            {/* Desktop Command Palette Search Trigger next to Logo */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] hover:bg-[var(--surface-glass)]/80 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer group shadow-sm"
              aria-label="Search developer showcases"
            >
              <svg className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[#0052ff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-normal">Search dev...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-[var(--card)] text-[var(--foreground-muted)] text-[10px] font-mono border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center: Desktop Tags responsive bar with daily.dev smooth switching */}
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
                      ? "bg-[#0052ff] text-white font-bold shadow-sm shadow-blue-500/25 scale-102"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Right: New Count + Submit Project + Mobile Search + Notifications + User Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile search trigger icon */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="sm:hidden p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
              aria-label="Open search dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 94 new today badge pill (Clean badge without highlighting dot) */}
            <div className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold select-none">
              <span>94 new today</span>
            </div>

            {/* + Submit Project Button (Mobile first, perfectly responsive down to 320px) */}
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="text-sm leading-none">+</span>
              <span className="hidden min-[380px]:inline">Submit</span>
              <span className="hidden sm:inline">Project</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
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
                  className="flex items-center rounded-full ring-2 ring-blue-500/40 hover:ring-blue-500 transition-all cursor-pointer"
                  aria-label="User account menu"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {(session.user.name || "I")[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl py-1.5 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-[var(--border)]">
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">
                        {session.user.name}
                      </p>
                      <p className="text-[11px] text-[var(--foreground-muted)] truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href={`/${userSlug}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookmarks"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
                    >
                      Bookmarks
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-[var(--border)] my-1" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-500 hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/40 hover:scale-105 transition-all cursor-pointer"
                title="Sign in with GitHub"
                aria-label="Sign in"
              >
                I
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Category Tags: Smooth daily.dev scrollable pills (320px+) */}
        <div className="md:hidden border-t border-[var(--border)] px-2.5 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 bg-[var(--card)]/40 backdrop-blur-md">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#0052ff] text-white font-bold shadow-sm shadow-blue-500/25"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
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
