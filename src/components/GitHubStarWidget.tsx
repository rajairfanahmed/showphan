"use client";

import React, { useState, useEffect } from "react";

interface GitHubStarWidgetProps {
  variant?: "compact" | "hero";
  showCreator?: boolean;
}

export function GitHubStarWidget({
  variant = "compact",
  showCreator = false,
}: GitHubStarWidgetProps) {
  const [stars, setStars] = useState<string>("142");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/github/stars")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.formatted) {
          setStars(data.formatted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const repoUrl = "https://github.com/rajairfanahmed/showphan";
  const portfolioUrl = "https://rajairfanahmed.vercel.app";

  if (variant === "hero") {
    return (
      <div className="inline-flex flex-wrap items-center justify-center gap-3">
        {/* Star Button */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-amber-500/30 bg-zinc-900/90 hover:bg-zinc-800 hover:border-amber-500/60 transition-all duration-200 shadow-md text-sm font-semibold select-none cursor-pointer"
          title="Star Showphan on GitHub"
        >
          <svg
            className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-200 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.169-7.333-3.856-7.333 3.856 1.399-8.169-5.934-5.784 8.2-1.192zm0 5.702l-2.223 4.505-4.971.722 3.597 3.506-.848 4.952 4.445-2.337 4.445 2.337-.848-4.952 3.597-3.506-4.971-.722z" />
          </svg>
          <span className="text-zinc-200 group-hover:text-white">Star on GitHub</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 transition-opacity ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            ★ {stars}
          </span>
        </a>

        {/* Creator Attribution Link */}
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-xs font-medium text-zinc-400 hover:text-amber-400 transition-all duration-200 select-none cursor-pointer"
          title="Creator Portfolio - Raja Irfan Ahmed"
        >
          <span>Crafted by</span>
          <span className="font-bold text-zinc-200 group-hover:text-amber-400">
            Raja Irfan Ahmed
          </span>
          <span className="text-zinc-500 group-hover:translate-x-0.5 transition-transform">
            ↗
          </span>
        </a>
      </div>
    );
  }

  // Compact variant for Navbar Header
  return (
    <div className="flex items-center gap-2">
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-sm font-medium text-[var(--foreground)] transition-colors select-none"
        title="Star Showphan on GitHub"
      >
        <svg
          className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.169-7.333-3.856-7.333 3.856 1.399-8.169-5.934-5.784 8.2-1.192zm0 5.702l-2.223 4.505-4.971.722 3.597 3.506-.848 4.952 4.445-2.337 4.445 2.337-.848-4.952 3.597-3.506-4.971-.722z" />
        </svg>
        <span className="hidden sm:inline">Star</span>
        <span
          className={`px-1.5 py-0.2 rounded font-mono text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {stars}
        </span>
      </a>

      {showCreator && (
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-amber-400 transition-colors font-medium"
          title="Creator Portfolio"
        >
          <span>By Raja Irfan Ahmed</span>
          <span>↗</span>
        </a>
      )}
    </div>
  );
}
