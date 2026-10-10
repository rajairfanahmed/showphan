"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

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

  if (!isOpen) return null;

  const quickLinks = [
    { title: "Community Feed", href: "/", icon: "🏠" },
    { title: "Trending Projects", href: "/?sort=trending", icon: "🔥" },
    { title: "Explore All Showcases", href: "/explore", icon: "🧭" },
    { title: "Inspiration Vault & Bookmarks", href: "/dashboard/bookmarks", icon: "🔖" },
    { title: "Developer Leaderboard", href: "/leaderboard", icon: "🏆" },
    { title: "Submit New Project", href: "/dashboard/new", icon: "✨" },
  ];

  const technologies = [
    { name: "Next.js", slug: "nextjs", icon: "▲" },
    { name: "React", slug: "react", icon: "⚛" },
    { name: "Tailwind CSS", slug: "tailwind", icon: "🎨" },
    { name: "TypeScript", slug: "typescript", icon: "TS" },
    { name: "Rust", slug: "rust", icon: "🦀" },
    { name: "Python", slug: "python", icon: "🐍" },
  ];

  const filteredLinks = quickLinks.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTech = technologies.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
            <svg className="w-5 h-5 text-[var(--foreground-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search developers, projects, tech stacks..."
              className="w-full bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none"
            />
            <kbd className="px-2 py-0.5 rounded bg-[var(--surface-glass)] text-[var(--foreground-muted)] text-[10px] font-mono border border-[var(--border)]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
            {/* Quick Links */}
            {filteredLinks.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Quick Navigation
                </span>
                {filteredLinks.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)] group-hover:text-amber-500 transition-colors">
                      Jump →
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Technologies Filter */}
            {filteredTech.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Filter by Technology
                </span>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {filteredTech.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSelect(`/?tech=${item.slug}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-md bg-[var(--surface-glass)] flex items-center justify-center text-[10px] text-amber-500 font-bold border border-[var(--border)]">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredLinks.length === 0 && filteredTech.length === 0 && (
              <div className="py-12 text-center text-[var(--foreground-muted)] text-sm">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-4 py-2.5 bg-[var(--surface-glass)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--foreground-muted)] font-mono">
            <span>Showphan Command Studio</span>
            <div className="flex items-center gap-2">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
