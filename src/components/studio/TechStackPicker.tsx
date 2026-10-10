"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { TechBadge } from "@/components/TechBadge";
import {
  CATALOG_TECHNOLOGIES,
  TECH_CATEGORIES,
  TechnologyCatalogItem,
} from "@/lib/catalog/technologies";

export interface TechnologyItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
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
  // Start with full instant catalog so count and icons are available immediately
  const [technologies, setTechnologies] =
    useState<TechnologyCatalogItem[]>(CATALOG_TECHNOLOGIES);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with /api/technologies
  useEffect(() => {
    async function loadTech() {
      try {
        const res = await fetch("/api/technologies");
        if (res.ok) {
          const data = await res.json();
          if (data.technologies && data.technologies.length > 0) {
            setTechnologies(data.technologies);
          }
        }
      } catch (err) {
        console.warn("Using offline catalog technologies", err);
      } finally {
        setLoading(false);
      }
    }
    loadTech();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTechs = useMemo(() => {
    return selectedTechIds
      .map((id) => technologies.find((t) => t.id === id || t.slug === id))
      .filter((t): t is TechnologyCatalogItem => Boolean(t));
  }, [selectedTechIds, technologies]);

  // Quick suggestions: popular technologies
  const popularPresets = useMemo(() => {
    const popularSlugs = [
      "nextjs",
      "react",
      "typescript",
      "tailwindcss",
      "python",
      "rust",
      "go",
      "docker",
      "postgresql",
      "supabase",
      "bun",
      "openai",
    ];
    return technologies.filter(
      (t) =>
        popularSlugs.includes(t.slug) &&
        !selectedTechIds.includes(t.id) &&
        !selectedTechIds.includes(t.slug)
    );
  }, [technologies, selectedTechIds]);

  // Filtered search list
  const filteredTechnologies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return technologies.filter(
        (t) =>
          !selectedTechIds.includes(t.id) && !selectedTechIds.includes(t.slug)
      );
    }
    return technologies
      .filter(
        (t) =>
          !selectedTechIds.includes(t.id) && !selectedTechIds.includes(t.slug)
      )
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
  }, [technologies, search, selectedTechIds]);

  // Catalog filtered by selectedCategory
  const catalogForCategory = useMemo(() => {
    if (selectedCategory === "All") return technologies;
    return technologies.filter((t) => t.category === selectedCategory);
  }, [technologies, selectedCategory]);

  const handleToggleTech = (tech: TechnologyCatalogItem) => {
    if (disabled) return;
    const isSelected =
      selectedTechIds.includes(tech.id) || selectedTechIds.includes(tech.slug);
    if (isSelected) {
      onChange(
        selectedTechIds.filter((id) => id !== tech.id && id !== tech.slug)
      );
    } else {
      onChange([...selectedTechIds, tech.id]);
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
    <div className="space-y-3.5" ref={dropdownRef}>
      {/* Header with Title and Total Catalog Count Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-bold text-[var(--foreground)]">
            Technologies & Tools <span className="text-[#0052ff]">* (at least 1)</span>
          </label>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-[#0052ff] dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052ff] animate-pulse" />
            {technologies.length}+ Brand Icons Available
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCatalogExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0052ff] dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>{isCatalogExpanded ? "Hide Full Catalog" : `Browse All Icons (${technologies.length})`}</span>
          </button>
          <span className="text-xs text-[var(--foreground-muted)] font-mono">
            {selectedTechIds.length} selected
          </span>
        </div>
      </div>

      {/* Selected Tech Chips with official brand icons and 1-click remove */}
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
            placeholder={`Search across all ${technologies.length}+ technologies & icons (e.g. Next.js, Rust, Docker)...`}
            disabled={disabled}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 text-sm transition-all"
          />
          <div className="absolute right-3 text-[11px] font-mono text-[var(--foreground-muted)] pointer-events-none">
            {filteredTechnologies.length} matches
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl shadow-2xl z-30 max-h-72 overflow-y-auto space-y-1">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-[var(--foreground-muted)] border-b border-[var(--border)]/60 mb-1">
              <span>Matching Supported Technologies:</span>
              <span>Showing {filteredTechnologies.length} of {technologies.length}</span>
            </div>
            {loading ? (
              <div className="p-4 text-center text-xs text-[var(--foreground-muted)]">
                Loading technology catalog...
              </div>
            ) : filteredTechnologies.length > 0 ? (
              filteredTechnologies.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleToggleTech(tech)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] hover:bg-blue-500/10 hover:text-[#0052ff] transition-colors cursor-pointer text-left"
                >
                  <TechBadge name={tech.name} iconName={tech.iconColor || undefined} size="sm" />
                  <div className="flex items-center gap-2">
                    {tech.category && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                        {tech.category}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-mono text-[#0052ff] font-bold">Add +</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[var(--foreground-muted)]">
                No technologies found matching &ldquo;{search}&rdquo;. You can add custom technologies in your project description.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Full Catalog Shelf (daily.dev style comprehensive icon list) */}
      {isCatalogExpanded && (
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md space-y-3.5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold text-[var(--foreground)]">
              Full Technology & Icon Catalog ({catalogForCategory.length} items):
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {TECH_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedCategory === category
                      ? "bg-[#0052ff] text-white shadow-sm"
                      : "bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
            {catalogForCategory.map((tech) => {
              const isSelected =
                selectedTechIds.includes(tech.id) ||
                selectedTechIds.includes(tech.slug);

              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleToggleTech(tech)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0052ff] bg-blue-500/15 text-[#0052ff] font-bold shadow-sm"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-blue-500/40 hover:bg-blue-500/5 text-[var(--foreground)]"
                  }`}
                  title={`${tech.name} (${tech.category || "Tool"})`}
                >
                  <TechBadge
                    name={tech.name}
                    iconName={tech.iconColor || undefined}
                    size="sm"
                  />
                  {isSelected && (
                    <span className="ml-auto text-[10px] text-[#0052ff] font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Preset Pills for Popular Tools */}
      {!isCatalogExpanded && popularPresets.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
            Quick Add Popular:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {popularPresets.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => handleToggleTech(tech)}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[#0052ff] hover:text-[#0052ff] hover:bg-blue-500/5 active:scale-95 transition-all cursor-pointer"
              >
                <span>+</span>
                <TechBadge name={tech.name} iconName={tech.iconColor || undefined} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
