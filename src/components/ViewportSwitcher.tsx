"use client";

import React from "react";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface ViewportOption {
  id: ViewportMode;
  label: string;
  width: string;
  pxWidth?: number;
  icon: React.ReactNode;
}

export const VIEWPORT_OPTIONS: ViewportOption[] = [
  {
    id: "desktop",
    label: "Desktop",
    width: "100%",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tablet",
    label: "Tablet",
    width: "768px",
    pxWidth: 768,
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
        <line x1="11" y1="18" x2="13" y2="18" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    width: "375px",
    pxWidth: 375,
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="5" y="2" width="14" height="20" rx="3" strokeWidth="2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

interface ViewportSwitcherProps {
  current: ViewportMode;
  onChange: (mode: ViewportMode) => void;
}

export function ViewportSwitcher({ current, onChange }: ViewportSwitcherProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Viewport Device Switcher"
      className="inline-flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1 shadow-inner"
    >
      {VIEWPORT_OPTIONS.map((opt) => {
        const isActive = current === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${opt.label} view (${opt.width})`}
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 select-none ${
              isActive
                ? "bg-[#0052ff] text-white shadow-sm font-bold scale-100"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <span>{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
            <span className={`text-[10px] opacity-75 font-mono ${isActive ? "text-white/80 font-bold" : "text-[var(--muted-foreground)]"}`}>
              {opt.width}
            </span>
          </button>
        );
      })}
    </div>
  );
}
