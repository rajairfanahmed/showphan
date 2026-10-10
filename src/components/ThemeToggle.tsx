"use client";

import { useEffect, useState } from "react";

function applyTheme(t: "dark" | "light" | "system") {
  if (typeof window === "undefined") return;
  if (t === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", t);
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("showphan-theme") as "dark" | "light" | "system" | null;
    const initialTheme = saved || "light";
    applyTheme(initialTheme);
    const timer = setTimeout(() => {
      setTheme(initialTheme);
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const cycleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("showphan-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  return (
    <button
      onClick={cycleTheme}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-sm cursor-pointer"
      title={`Current theme: ${theme}. Click to change.`}
      aria-label="Toggle theme"
    >
      {theme === "dark" && (
        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      {theme === "light" && (
        <svg className="w-4 h-4 text-[#0052ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      {theme === "system" && (
        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
