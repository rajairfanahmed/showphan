"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react/offline";
import { initOfflineIcons } from "@/lib/catalog/icons";

interface TechBadgeProps {
  name: string;
  iconName?: string;
  size?: "sm" | "md";
}

const ACCENT_PALETTES = [
  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-500 dark:text-indigo-400", dot: "bg-indigo-500" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", dot: "bg-violet-400" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400" },
];

function getPaletteForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_PALETTES[Math.abs(hash) % ACCENT_PALETTES.length];
}

export function TechBadge({ name, iconName, size = "md" }: TechBadgeProps) {
  useEffect(() => {
    initOfflineIcons();
  }, []);

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  const iconSize = size === "sm" ? 14 : 16;
  const isCustom = !iconName || iconName === "custom" || iconName.trim() === "";

  if (isCustom) {
    const palette = getPaletteForName(name);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border ${palette.border} ${palette.bg} ${palette.text} font-medium ${sizeClasses} shadow-sm select-none`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} shrink-0`} />
        <span>{name}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-medium ${sizeClasses} shadow-sm select-none`}
    >
      <Icon icon={iconName} width={iconSize} height={iconSize} className="shrink-0" />
      <span>{name}</span>
    </span>
  );
}
