"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react/offline";
import { initOfflineIcons } from "@/lib/catalog/icons";

interface TechBadgeProps {
  name: string;
  iconName?: string;
  size?: "sm" | "md";
}

export function TechBadge({ name, iconName, size = "md" }: TechBadgeProps) {
  useEffect(() => {
    initOfflineIcons();
  }, []);

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-medium ${sizeClasses} shadow-sm select-none`}
    >
      {iconName ? (
        <Icon icon={iconName} width={iconSize} height={iconSize} className="shrink-0" />
      ) : (
        <svg className="shrink-0 opacity-70" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )}
      <span>{name}</span>
    </span>
  );
}
