"use client";

import React, { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("showphan-theme", "light");
    } catch {}
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[#0052ff] select-none shadow-xs"
      title="Theme: Ceramic Daylight"
    >
      <svg
        className="w-3.5 h-3.5 text-[#0052ff]"
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
      <span>Daylight</span>
    </div>
  );
}
