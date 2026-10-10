"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { HomepageFeed, INITIAL_SHOWCASE_PROJECTS } from "@/components/feed/HomepageFeed";
import { FloatingActions } from "@/components/common/FloatingActions";
import { ProjectCardData } from "@/components/cards/ProjectCard";

interface HomepageShellProps {
  initialProjects?: ProjectCardData[];
}

export function HomepageShell({
  initialProjects = INITIAL_SHOWCASE_PROJECTS,
}: HomepageShellProps) {
  const [activeNav, setActiveNav] = useState("feed");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Main Platform Shell: Mobile-first responsive container (starting from 320px) */}
      <div className="w-full max-w-[1750px] mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex gap-4 lg:gap-6 xl:gap-8 items-start flex-1">
        {/* Floating Rounded Sidebar with panel dock toggle and collapsed theme switcher */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* 
          Main Community Feed:
          Fluid width that expands when sidebar closes and decreases when opened like daily.dev
        */}
        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
          <HomepageFeed initialProjects={initialProjects} />
        </main>
      </div>

      {/* Bottom Floating Actions */}
      <FloatingActions />
    </div>
  );
}
