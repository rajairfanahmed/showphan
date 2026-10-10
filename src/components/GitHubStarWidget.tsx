"use client";

import { useEffect, useState } from "react";

interface GitHubStarWidgetProps {
  variant?: "compact" | "full";
  showCreator?: boolean;
}

export function GitHubStarWidget({
  variant = "compact",
  showCreator = true,
}: GitHubStarWidgetProps) {
  const [stars, setStars] = useState<number>(128);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch("https://api.github.com/repos/rajairfanahmed/showphan", {
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.stargazers_count === "number") {
            setStars(data.stargazers_count);
          }
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }
    fetchStars();
  }, []);

  const repoUrl = "https://github.com/rajairfanahmed/showphan";
  const portfolioUrl = "https://rajairfanahmed.vercel.app";

  if (variant === "full") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {/* Star Button */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-blue-500/20 bg-white hover:border-blue-500/50 transition-all duration-200 shadow-sm text-sm font-semibold select-none cursor-pointer"
          title="Star Showphan on GitHub"
        >
          <svg
            className="w-4 h-4 text-[#0052ff] group-hover:scale-110 transition-transform duration-200 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.169-7.333-3.856-7.333 3.856 1.399-8.169-5.934-5.784 8.2-1.192zm0 5.702l-2.223 4.505-4.971.722 3.597 3.506-.848 4.952 4.445-2.337 4.445 2.337-.848-4.952 3.597-3.506-4.971-.722z" />
          </svg>
          <span className="text-[var(--foreground)]">Star on GitHub</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-[#0052ff] border border-blue-500/20 transition-opacity ${
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
          className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[var(--border)] bg-white hover:border-blue-500/40 text-xs font-medium text-[var(--foreground-muted)] hover:text-[#0052ff] transition-all duration-200 select-none cursor-pointer"
          title="Creator Portfolio - Raja Irfan Ahmed"
        >
          <span>Crafted by</span>
          <span className="font-bold text-[var(--foreground)] group-hover:text-[#0052ff]">
            Raja Irfan Ahmed
          </span>
          <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
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
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-white hover:border-blue-500/40 text-sm font-medium text-[var(--foreground)] transition-colors select-none shadow-sm"
        title="Star Showphan on GitHub"
      >
        <svg
          className="w-3.5 h-3.5 text-[#0052ff] group-hover:scale-110 transition-transform fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.169-7.333-3.856-7.333 3.856 1.399-8.169-5.934-5.784 8.2-1.192zm0 5.702l-2.223 4.505-4.971.722 3.597 3.506-.848 4.952 4.445-2.337 4.445 2.337-.848-4.952 3.597-3.506-4.971-.722z" />
        </svg>
        <span className="hidden sm:inline text-xs font-semibold">Star</span>
        <span
          className={`px-1.5 py-0.2 rounded font-mono text-xs font-semibold bg-blue-500/10 text-[#0052ff] border border-blue-500/20 ${
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
          className="hidden lg:inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[#0052ff] transition-colors font-medium"
          title="Creator Portfolio"
        >
          <span>By Raja Irfan Ahmed</span>
          <span>↗</span>
        </a>
      )}
    </div>
  );
}
