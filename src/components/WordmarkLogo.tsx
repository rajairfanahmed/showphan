import React from "react";
import Link from "next/link";
import { TrophyLogo } from "./TrophyLogo";

interface WordmarkLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  showBetaBadge?: boolean;
  href?: string;
  className?: string;
}

export function WordmarkLogo({
  size = "md",
  href = "/",
  className = "",
}: WordmarkLogoProps) {
  // Prominently sized logo representing the platform
  const iconSize = size === "sm" ? 30 : size === "lg" ? 42 : size === "xl" ? 48 : 36;

  const Content = (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      title="Showphan"
    >
      {/* Exact Trophy Logo clearly big shown without any text */}
      <div className="shrink-0 text-[#0052ff] hover:text-blue-600 transition-transform duration-200 hover:scale-105 flex items-center justify-center">
        <TrophyLogo size={iconSize} />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center" aria-label="Showphan">
        {Content}
      </Link>
    );
  }

  return Content;
}
