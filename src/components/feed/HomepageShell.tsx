"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { HomepageFeed } from "@/components/feed/HomepageFeed";
import { FloatingActions } from "@/components/common/FloatingActions";
import { MobileNavigationDock } from "@/components/navigation/MobileNavigationDock";
import { ProjectCardData } from "@/components/cards/ProjectCard";

const emptySubscribe = () => () => {};

interface HomepageShellProps {
  initialProjects?: ProjectCardData[];
  initialCollapsed?: boolean;
}

export function HomepageShell({
  initialProjects = [],
  initialCollapsed = false,
}: HomepageShellProps) {
  const [activeNav, setActiveNav] = useState("feed");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return initialCollapsed;
    try {
      const stored = localStorage.getItem("showphan-sidebar-collapsed");
      if (stored !== null) return stored === "true";
    } catch {}
    return initialCollapsed;
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      // Persist to cookie for flicker-free SSR refresh matching
      document.cookie = `showphan-sidebar-collapsed=${next}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem("showphan-sidebar-collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-blue-500/25 selection:text-blue-900 dark:selection:text-blue-200 pb-20 lg:pb-0">
      {/* Main Platform Shell: Mobile-first responsive container (starting from 320px) */}
      <div className="w-full max-w-[1750px] mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex gap-4 lg:gap-6 xl:gap-8 items-start flex-1">
        {/* Floating Rounded Sidebar with panel dock toggle and collapsed theme switcher */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={handleToggleSidebar}
        />

        {/* 
          Main Community Feed:
          Fluid width that expands when sidebar closes and decreases when opened like daily.dev
        */}
        <main className={`flex-1 min-w-0 ${isMounted ? "transition-[width] duration-300 ease-in-out" : "transition-none"}`}>
          <HomepageFeed initialProjects={initialProjects} />
        </main>
      </div>

      {/* Daily.dev Style Floating Mobile Navigation Dock (< 1024px) */}
      <MobileNavigationDock />

      {/* Bottom Floating Actions */}
      <FloatingActions />
    </div>
  );
}
