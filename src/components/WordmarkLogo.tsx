import React from "react";
import Link from "next/link";

interface WordmarkLogoProps {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  showBetaBadge?: boolean;
  href?: string;
  className?: string;
}

export function WordmarkLogo({
  size = "md",
  iconOnly = false,
  showBetaBadge = false,
  href = "/",
  className = "",
}: WordmarkLogoProps) {
  // Dimensions based on size
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 34;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  const Monogram = (
    <div
      style={{ width: iconSize, height: iconSize }}
      className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/80 shadow-md group-hover:border-amber-500/60 transition-colors"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%]"
      >
        {/* Left Geometric Bracket */}
        <path
          d="M12 9L5 18L12 27"
          stroke="#f59e0b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Forward Slash */}
        <path
          d="M21 7L15 29"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Right Geometric Bracket */}
        <path
          d="M24 9L31 18L24 27"
          stroke="#f59e0b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Core Amber Spark Accent */}
        <circle cx="18" cy="18" r="1.5" fill="#fbbf24" />
      </svg>
    </div>
  );

  const Content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {Monogram}

      {!iconOnly && (
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-[var(--foreground)] group-hover:text-amber-500 transition-colors ${textSize}`}
          >
            showphan
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
          {showBetaBadge && (
            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 ml-1">
              v2.0
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center" aria-label="Showphan Home">
        {Content}
      </Link>
    );
  }

  return Content;
}
