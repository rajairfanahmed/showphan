"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { TechBadge } from "@/components/TechBadge";

export interface TechnologyItem {
  id: string;
  name: string;
  slug: string;
  iconColor?: string | null;
  iconMono?: string | null;
}

interface TechStackPickerProps {
  selectedTechIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function TechStackPicker({
  selectedTechIds,
  onChange,
  disabled = false,
}: TechStackPickerProps) {
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load technologies catalog
  useEffect(() => {
    async function loadTech() {
      try {
        setLoading(true);
        const res = await fetch("/api/technologies");
        if (res.ok) {
          const data = await res.json();
          setTechnologies(data.technologies || []);
        }
      } catch (err) {
        console.error("Failed to load technologies", err);
      } finally {
        setLoading(false);
      }
    }
    loadTech();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTechs = useMemo(() => {
    return selectedTechIds
      .map((id) => technologies.find((t) => t.id === id))
      .filter((t): t is TechnologyItem => Boolean(t));
  }, [selectedTechIds, technologies]);

  // Quick suggestions: popular technologies
  const popularPresets = useMemo(() => {
    const popularSlugs = ["nextjs", "react", "typescript", "tailwind", "python", "rust", "go", "bun"];
    return technologies.filter((t) => popularSlugs.includes(t.slug) && !selectedTechIds.includes(t.id));
  }, [technologies, selectedTechIds]);

  const filteredTechnologies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return technologies.filter((t) => !selectedTechIds.includes(t.id)).slice(0, 15);
    }
    return technologies
      .filter((t) => !selectedTechIds.includes(t.id))
      .filter((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
      .slice(0, 15);
  }, [technologies, search, selectedTechIds]);

  const handleToggleTech = (techId: string) => {
    if (disabled) return;
    if (selectedTechIds.includes(techId)) {
      onChange(selectedTechIds.filter((id) => id !== techId));
    } else {
      onChange([...selectedTechIds, techId]);
      setSearch("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveTech = (techId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedTechIds.filter((id) => id !== techId));
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[var(--foreground)]">
          Technologies & Tools <span className="text-[#0052ff]">* (at least 1)</span>
        </label>
        <span className="text-xs text-[var(--foreground-muted)]">
          {selectedTechIds.length} selected
        </span>
      </div>

      {/* Selected Tech Chips with official brand icons and 1-click remove trigger */}
      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          {selectedTechs.map((tech) => (
            <div
              key={tech.id}
              className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-[#0052ff] dark:text-blue-300 shadow-sm transition-all"
            >
              <TechBadge name={tech.name} iconName={tech.iconColor || undefined} size="sm" />
              <button
                type="button"
                onClick={(e) => handleRemoveTech(tech.id, e)}
                disabled={disabled}
                className="hover:text-red-500 text-blue-500/70 dark:text-blue-300/70 transition-colors p-0.5 rounded cursor-pointer"
                title={`Remove ${tech.name}`}
                aria-label={`Remove ${tech.name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input with Auto-Complete Dropdown */}
      <div className="relative">
        <div className="relative flex items-center">
          <svg
            className="w-4 h-4 absolute left-3.5 text-[var(--foreground-muted)] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search technologies (e.g. Next.js, Rust, Docker)..."
            disabled={disabled}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 text-sm transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl shadow-2xl z-30 max-h-56 overflow-y-auto space-y-1">
            {loading ? (
              <div className="p-3 text-center text-xs text-[var(--foreground-muted)]">
                Loading technology catalog...
              </div>
            ) : filteredTechnologies.length > 0 ? (
              filteredTechnologies.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleToggleTech(tech.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[var(--foreground)] hover:bg-blue-500/10 hover:text-[#0052ff] transition-colors cursor-pointer text-left"
                >
                  <TechBadge name={tech.name} iconName={tech.iconColor || undefined} size="sm" />
                  <span className="text-[10px] uppercase font-mono text-[var(--foreground-muted)]">Add +</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-[var(--foreground-muted)]">
                No technologies found matching &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Preset Pills for Popular Tools */}
      {popularPresets.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
            Quick Add Popular:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {popularPresets.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => handleToggleTech(tech.id)}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[#0052ff] hover:text-[#0052ff] hover:bg-blue-500/5 active:scale-95 transition-all cursor-pointer"
              >
                <span>+</span>
                <span>{tech.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
