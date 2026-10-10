"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { WordmarkLogo } from "@/components/WordmarkLogo";
import { CommandPalette } from "@/components/modals/CommandPalette";

function TopNavbarContent({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const { data: session } = useSession();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "nextjs", label: "Next.js" },
    { id: "ai-ml", label: "AI & ML" },
    { id: "dev-tools", label: "Dev Tools" },
    { id: "open-source", label: "Open Source" },
  ];

  const handleCategoryClick = (catId: string) => {
    if (catId === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${catId}`);
    }
  };

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
        <div className="w-full px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Mobile Sidebar Toggle + Brand Logo + Command Palette Search Bar */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}

            {/* Logo with Exact Trophy SVG and no dot */}
            <WordmarkLogo size="md" showBetaBadge={false} />

            {/* Search Bar (Command Palette Trigger) positioned beside Logo */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] hover:bg-[var(--surface-glass)]/80 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer group shadow-sm"
            >
              <svg className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-normal">Search dev...</span>
              <kbd className="ml-3 px-1.5 py-0.5 rounded bg-[var(--card)] text-[var(--foreground-muted)] text-[10px] font-mono border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center: Category Filter Pills with high contrast for Day and Night */}
          <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-amber-500 text-black font-bold shadow-sm shadow-amber-500/20"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header: New Count + Submit Project + Notifications + User Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Mobile search trigger icon */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="sm:hidden p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 94 new today badge pill */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>94 new today</span>
            </div>

            {/* + Submit Project Button (crisp Google-style feel) */}
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-98 transition-all cursor-pointer"
            >
              <span>+</span>
              <span>Submit Project</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--card)]" />
            </button>

            {/* User Profile Avatar with dropdown or Sign In */}
            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center rounded-full ring-2 ring-amber-500/40 hover:ring-amber-500 transition-all cursor-pointer"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
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
                      Bookmarks 🔖
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
                onClick={handleSignIn}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-amber-500/40 hover:scale-105 transition-all cursor-pointer"
                title="Sign in with GitHub"
              >
                I
              </button>
            )}
          </div>
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
    <Suspense fallback={<div className="h-16 w-full bg-[var(--glass-bg)] border-b border-[var(--border)]" />}>
      <TopNavbarContent onToggleSidebar={onToggleSidebar} />
    </Suspense>
  );
}
