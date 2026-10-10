"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeNav?: string;
  onSelectNav?: (navId: string) => void;
}

export function Sidebar({
  isMobileOpen = false,
  onCloseMobile,
  activeNav = "feed",
  onSelectNav,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Synchronize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setIsDarkTheme(currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDarkTheme ? "light" : "dark";
    // Change theme immediately with zero lag like daily.dev
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("showphan-theme", nextTheme);
    setIsDarkTheme(nextTheme === "dark");
  };

  const navItems = [
    {
      id: "feed",
      label: "My Feed",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      activeDot: true,
    },
    {
      id: "explore",
      label: "Explore",
      href: "/explore",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2.5 5.5-5.5 2.5 2.5-5.5 5.5-2.5z" />
        </svg>
      ),
    },
    {
      id: "trending",
      label: "Trending",
      href: "/?sort=trending",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      badge: { text: "HOT", color: "bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30" },
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      href: "/dashboard/bookmarks",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      badge: { text: "18", color: "bg-[var(--surface-glass)] text-[var(--foreground-muted)] border-[var(--border)]" },
    },
    {
      id: "tags",
      label: "Tags",
      href: "/explore",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      href: "/leaderboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: { text: "Top 100", color: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
    },
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div
      className={`h-full flex flex-col justify-between transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Top Section */}
      <div className="space-y-3">
        {/* Header with Expand/Collapse Icon */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Menu
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Links with High-Contrast Day and Night Styling */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeNav === item.id || (item.id === "feed" && pathname === "/");

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectNav?.(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer group select-none ${
                  isActive
                    ? "bg-amber-500/15 text-[var(--foreground)] font-bold border border-amber-500/30 shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={item.label}
              >
                {/* Active Indicator Left Pill / Dot */}
                {item.activeDot && isActive && !isCollapsed && (
                  <span className="absolute left-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
                )}

                <span
                  className={`transition-colors shrink-0 ${
                    isActive
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border tracking-tight ${item.badge.color}`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Compulsory Theme Toggle (No Profile Card here) */}
      <div className="pt-3 border-t border-[var(--border)]">
        {/* Dark / Light Theme Toggle Switch */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-2xl bg-[var(--surface-glass)] border border-[var(--border)] ${
            isCollapsed ? "justify-center p-2" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {isDarkTheme ? (
              <svg
                className="w-4 h-4 text-amber-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-amber-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
            {!isCollapsed && (
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {isDarkTheme ? "Dark Theme" : "Light Theme"}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                isDarkTheme ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-100 ${
                  isDarkTheme ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Rounded Sidebar */}
      <aside className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)] shrink-0 z-30">
        <div className="h-full rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-2xl shadow-xl shadow-black/10 dark:shadow-black/30 p-3 overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 h-full bg-[var(--card)] border-r border-[var(--border)] p-4 shadow-2xl flex flex-col justify-between">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
