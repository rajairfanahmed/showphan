import React from "react";
import Link from "next/link";
import { TrophyLogo } from "./TrophyLogo";

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
  const iconSize = size === "sm" ? 26 : size === "lg" ? 38 : 30;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  const Content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Trophy Logo from logo.jpg */}
      <div className="shrink-0 text-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center">
        <TrophyLogo size={iconSize} />
      </div>

      {!iconOnly && (
        <div className="flex items-center gap-1.5">
          {/* Brand Name without any dot */}
          <span
            className={`font-black tracking-tight text-[var(--foreground)] group-hover:text-amber-500 transition-colors ${textSize}`}
          >
            Showphan
          </span>
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
