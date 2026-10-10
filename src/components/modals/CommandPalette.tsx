"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectSearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageKey?: string | null;
  kudosCount: number;
  user: {
    slug: string;
    displayName?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
  };
  technologies?: {
    technology: {
      id: string;
      name: string;
      slug: string;
      iconColor?: string | null;
    };
  }[];
}

interface TechItem {
  id?: string;
  name: string;
  slug: string;
  iconColor?: string | null;
  count?: number;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<ProjectSearchResult[]>([]);
  const [technologies, setTechnologies] = useState<TechItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initial load for trending showcases & tech catalog
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [exploreRes, techRes] = await Promise.all([
          fetch("/api/explore?tab=trending&limit=4"),
          fetch("/api/technologies"),
        ]);

        if (exploreRes.ok) {
          const eData = await exploreRes.json();
          setProjects(eData.projects || []);
        }

        if (techRes.ok) {
          const tData = await techRes.json();
          setTechnologies((tData.technologies || []).slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load command palette initial data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = query.trim()
          ? `/api/explore?q=${encodeURIComponent(query.trim())}&limit=6`
          : `/api/explore?tab=trending&limit=4`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
          if (data.popularTechnologies && data.popularTechnologies.length > 0) {
            setTechnologies(data.popularTechnologies.slice(0, 8));
          }
        }
      } catch (err) {
        console.error("Live search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: "Community Feed", href: "/", icon: "🏠" },
    { title: "Trending Projects", href: "/?sort=trending", icon: "🔥" },
    { title: "Explore All Showcases", href: "/explore", icon: "🧭" },
    { title: "Submit New Project", href: "/dashboard/new", icon: "✨" },
    { title: "Inspiration Vault & Bookmarks", href: "/dashboard/bookmarks", icon: "🔖" },
  ];

  const filteredQuickLinks = query.trim()
    ? quickLinks.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  const filteredTech = query.trim()
    ? technologies.filter((tech) =>
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.slug.toLowerCase().includes(query.toLowerCase())
      )
    : technologies;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--card)]">
            <svg
              className="w-5 h-5 text-[#0052ff] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search real projects, creators, technologies..."
              className="w-full bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none"
            />
            {isLoading && (
              <div className="w-4 h-4 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            <kbd className="px-2 py-0.5 rounded-lg bg-[var(--surface-muted)] text-[var(--foreground-muted)] text-[10px] font-mono border border-[var(--border)] shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[420px] overflow-y-auto p-2 space-y-4">
            {/* 1. Real Project Matches */}
            {projects.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center justify-between">
                  <span>{query.trim() ? "Live Project Matches" : "Trending Projects"}</span>
                  <span className="text-[#0052ff] font-mono text-[9px]">{projects.length} found</span>
                </span>
                <div className="space-y-1">
                  {projects.map((proj) => {
                    const projectUrl = `/${proj.user?.slug || "creator"}/${proj.slug}`;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => handleSelect(projectUrl)}
                        className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl text-left hover:bg-[var(--surface-muted)] border border-transparent hover:border-[var(--border)] transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {proj.coverImageKey ? (
                            <div className="relative w-10 h-7 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] bg-gray-100">
                              <Image
                                src={proj.coverImageKey}
                                alt={proj.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-7 rounded-lg shrink-0 bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-[#0052ff]">
                              ⚡
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[var(--foreground)] group-hover:text-[#0052ff] truncate">
                              {proj.title}
                            </div>
                            <div className="text-[11px] text-[var(--foreground-muted)] truncate flex items-center gap-1.5 mt-0.5">
                              <span>by @{proj.user?.displayName || proj.user?.name || proj.user?.slug}</span>
                              {proj.summary && <span>• {proj.summary}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052ff] border border-blue-100 font-mono text-[10px] font-bold">
                            ★ {proj.kudosCount}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)] group-hover:text-[#0052ff] transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Technologies Filter */}
            {filteredTech.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Filter by Technology
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 px-1">
                  {filteredTech.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => handleSelect(`/?tech=${item.slug}`)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-muted)] border border-transparent hover:border-[var(--border)] transition-all cursor-pointer group"
                    >
                      <span
                        className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{
                          backgroundColor: item.iconColor ? `${item.iconColor}15` : "#0052ff15",
                          color: item.iconColor || "#0052ff",
                        }}
                      >
                        #
                      </span>
                      <span className="truncate group-hover:text-[#0052ff]">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Quick Navigation */}
            {filteredQuickLinks.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Quick Navigation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                  {filteredQuickLinks.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSelect(item.href)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-[var(--foreground)] hover:bg-[var(--surface-muted)] border border-transparent hover:border-[var(--border)] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{item.icon}</span>
                        <span className="font-semibold truncate">{item.title}</span>
                      </div>
                      <span className="text-[10px] text-[var(--foreground-muted)] group-hover:text-[#0052ff]">
                        Jump →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search State */}
            {!isLoading &&
              projects.length === 0 &&
              filteredTech.length === 0 &&
              filteredQuickLinks.length === 0 && (
                <div className="py-12 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-base">
                    🔍
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    No showcases, creators, or tools matching &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}
          </div>

          {/* Footer Controls */}
          <div className="px-4 py-2.5 bg-[var(--surface-muted)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--foreground-muted)] font-mono">
            <span>Showphan Live Search</span>
            <div className="flex items-center gap-3">
              <span>Esc to Close</span>
              <span>↵ to Select</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
