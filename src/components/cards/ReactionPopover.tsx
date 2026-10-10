"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
}

export const DEVELOPER_REACTIONS: ReactionItem[] = [
  { id: "mindblown", emoji: "🚀", label: "Mindblown" },
  { id: "cleancode", emoji: "💎", label: "Clean Code" },
  { id: "greatui", emoji: "🎨", label: "Great UI" },
  { id: "blazingfast", emoji: "⚡", label: "Blazing Fast" },
  { id: "loved", emoji: "❤️", label: "Loved" },
  { id: "hot", emoji: "🔥", label: "Hot" },
];

interface ReactionPopoverProps {
  projectId: string;
  initialCounts?: Record<string, number>;
  initialActiveReaction?: string | null;
}

export function ReactionPopover({
  projectId,
  initialCounts = { mindblown: 5, cleancode: 3, greatui: 8, blazingfast: 4, loved: 6, hot: 12 },
  initialActiveReaction = null,
}: ReactionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(() => {
    if (typeof window === "undefined") return initialActiveReaction;
    try {
      return localStorage.getItem(`showphan_reaction_${projectId}`) || initialActiveReaction;
    } catch {
      return initialActiveReaction;
    }
  });
  const [prevProjectId, setPrevProjectId] = useState(projectId);
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId);
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(`showphan_reaction_${projectId}`) : null;
      setActiveReaction(saved || initialActiveReaction);
    } catch {
      setActiveReaction(initialActiveReaction);
    }
  }
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalReactions = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleSelectReaction = (reaction: ReactionItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isCurrent = activeReaction === reaction.id;
    const nextCounts = { ...counts };

    if (isCurrent) {
      setActiveReaction(null);
      nextCounts[reaction.id] = Math.max(0, (nextCounts[reaction.id] || 1) - 1);
      try {
        localStorage.removeItem(`showphan_reaction_${projectId}`);
      } catch {}
    } else {
      if (activeReaction && nextCounts[activeReaction]) {
        nextCounts[activeReaction] = Math.max(0, nextCounts[activeReaction] - 1);
      }
      setActiveReaction(reaction.id);
      nextCounts[reaction.id] = (nextCounts[reaction.id] || 0) + 1;
      try {
        localStorage.setItem(`showphan_reaction_${projectId}`, reaction.id);
      } catch {}
    }

    setCounts(nextCounts);
    setIsOpen(false);

    fetch(`/api/projects/${projectId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction: reaction.id }),
    }).catch(() => {});
  };

  const activeItem = DEVELOPER_REACTIONS.find((r) => r.id === activeReaction);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Lightweight, Snappy Facebook-style Reactions Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -42, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full z-50 flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-950 text-white border border-white/20 shadow-xl"
          >
            {DEVELOPER_REACTIONS.map((item) => {
              const isSelected = activeReaction === item.id;
              const isItemHovered = hoveredReaction === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelectReaction(item, e)}
                  onMouseEnter={() => setHoveredReaction(item.id)}
                  onMouseLeave={() => setHoveredReaction(null)}
                  className={`relative p-1 rounded-full text-base cursor-pointer transition-transform duration-100 ${
                    isSelected ? "bg-white/20 ring-1 ring-amber-400" : "hover:scale-120"
                  }`}
                  title={item.label}
                >
                  <span className="block leading-none">{item.emoji}</span>

                  {isItemHovered && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-bold text-white whitespace-nowrap border border-white/10 shadow-lg pointer-events-none animate-fade-in">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button with high contrast */}
      <button
        type="button"
        onClick={() => {
          if (activeReaction) {
            const current = DEVELOPER_REACTIONS.find((r) => r.id === activeReaction);
            if (current) handleSelectReaction(current);
          } else {
            handleSelectReaction(DEVELOPER_REACTIONS[0]);
          }
        }}
        className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
          activeReaction
            ? "border-amber-500/50 bg-amber-500/15 text-amber-500 dark:text-amber-400 shadow-sm"
            : "border-[var(--border)] bg-[var(--surface-glass)] hover:border-[var(--border-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="React with developer emojis"
      >
        <span className="text-sm transition-transform duration-100 group-hover:scale-110">
          {activeItem ? activeItem.emoji : "✨"}
        </span>
        <span className="font-mono text-xs">{totalReactions}</span>
      </button>
    </div>
  );
}
