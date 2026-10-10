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

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Main Platform Shell: Floating Sidebar + Feed */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-6 flex gap-6 xl:gap-8 items-start flex-1">
        {/* Floating Rounded Sidebar (expand/collapse toggle, glass hover, compulsory bottom theme switch) */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Community Feed (Tags row removed, sort kept, wider project cards) */}
        <main className="flex-1 min-w-0">
          <HomepageFeed initialProjects={initialProjects} />
        </main>
      </div>

      {/* Bottom-Right Floating Actions: Feedback Modal + Scroll-To-Top Going Up Button */}
      <FloatingActions />
    </div>
  );
}
