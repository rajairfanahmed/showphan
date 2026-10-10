"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeNav?: string;
  onSelectNav?: (navId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function Sidebar({
  isMobileOpen = false,
  onCloseMobile,
  activeNav = "feed",
  onSelectNav,
  isCollapsed: controlledCollapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === "undefined") return true;
    return document.documentElement.getAttribute("data-theme") !== "light";
  });

  // Allow either controlled or uncontrolled collapsed state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapsed = onToggleCollapsed || (() => setInternalCollapsed((prev) => !prev));

  // Observe theme attribute changes externally without cascading render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setIsDarkTheme(currentTheme === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
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
      badge: { text: "HOT", color: "bg-blue-500/10 text-[#0052ff] dark:text-blue-400 border-blue-500/25" },
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
      badge: { text: "Top 100", color: "bg-blue-500/10 text-[#0052ff] dark:text-blue-400 border-blue-500/20" },
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
      className={`h-full flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-12 sm:w-14 items-center" : "w-56 sm:w-60"
      }`}
    >
      {/* Top Section */}
      <div className="space-y-3 w-full">
        {/* Header with Panel Dock Icon (Strictly centered when collapsed) */}
        <div
          className={`flex items-center pt-1 pb-1 w-full ${
            isCollapsed ? "justify-center" : "justify-between px-2"
          }`}
        >
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Menu
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className={`p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer flex items-center justify-center ${
              isCollapsed ? "mx-auto" : "ml-auto"
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {/* Modern Panel Dock Icon */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="4" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>

        {/* Navigation Links (Clean styling without any highlighting dots) */}
        <nav className="space-y-1 w-full">
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
                    ? "bg-blue-500/10 text-[var(--foreground)] font-bold border border-blue-500/25 shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={item.label}
              >
                <span
                  className={`transition-colors shrink-0 ${
                    isActive
                      ? "text-[#0052ff] dark:text-blue-400"
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

      {/* Bottom Section: Theme Toggle (Fully accessible and centered even when sidebar is collapsed!) */}
      <div className="pt-3 border-t border-[var(--border)] w-full">
        {isCollapsed ? (
          /* Centered Theme Toggle Icon Button for Collapsed Mode */
          <div className="flex justify-center w-full">
            <button
              type="button"
              onClick={toggleTheme}
              title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
              aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
              className="w-10 h-10 rounded-xl bg-[var(--surface-glass)] border border-[var(--border)] hover:border-blue-500/40 text-[var(--foreground)] hover:text-[#0052ff] flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              {isDarkTheme ? (
                <svg
                  className="w-4 h-4 text-blue-400"
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
                  className="w-4 h-4 text-blue-600"
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
            </button>
          </div>
        ) : (
          /* Full Theme Toggle Switch for Expanded Mode */
          <div
            onClick={toggleTheme}
            className="flex items-center justify-between px-3 py-2 rounded-2xl bg-[var(--surface-glass)] border border-[var(--border)] cursor-pointer hover:border-blue-500/40 transition-colors"
            title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            <div className="flex items-center gap-2">
              {isDarkTheme ? (
                <svg
                  className="w-4 h-4 text-blue-400 shrink-0"
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
                  className="w-4 h-4 text-blue-600 shrink-0"
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
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {isDarkTheme ? "Dark Theme" : "Light Theme"}
              </span>
            </div>

            <div
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                isDarkTheme ? "bg-[#0052ff]" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-100 ${
                  isDarkTheme ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Rounded Sidebar */}
      <aside className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)] shrink-0 z-30 transition-all duration-300">
        <div className="h-full rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-2xl shadow-xl shadow-black/10 dark:shadow-black/30 p-2 sm:p-3 overflow-hidden">
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
          <div className="relative w-64 sm:w-72 h-full bg-[var(--card)] border-r border-[var(--border)] p-4 shadow-2xl flex flex-col justify-between">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
