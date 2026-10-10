"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { HomepageFeed } from "@/components/feed/HomepageFeed";
import { FloatingActions } from "@/components/common/FloatingActions";
import { MobileNavigationDock } from "@/components/navigation/MobileNavigationDock";
import { ProjectCardData } from "@/components/cards/ProjectCard";

interface HomepageShellProps {
  initialProjects?: ProjectCardData[];
}

export function HomepageShell({
  initialProjects = [],
}: HomepageShellProps) {
  const [activeNav, setActiveNav] = useState("feed");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("showphan-sidebar-collapsed") === "true";
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("showphan-sidebar-collapsed", String(next));
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
        <main className="flex-1 min-w-0 transition-[width] duration-300 ease-in-out">
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
