"use client";

import React, { useState, useEffect } from "react";
import {
  REACTION_DEFINITIONS,
  ReactionType,
  ReactionCounts,
} from "@/lib/projects/reactions";

interface PeerReactionsProps {
  projectId: string;
  repoUrl?: string | null;
  initialCounts?: Partial<ReactionCounts>;
}

export function PeerReactions({
  projectId,
  repoUrl,
  initialCounts,
}: PeerReactionsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    mindblown: initialCounts?.mindblown ?? 3,
    cleanCode: initialCounts?.cleanCode ?? 2,
    greatUi: initialCounts?.greatUi ?? 5,
    blazingFast: initialCounts?.blazingFast ?? 4,
  });

  const [activeReactions, setActiveReactions] = useState<Set<ReactionType>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const storageKey = `showphan_peer_reactions_${projectId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed as ReactionType[]);
        }
      }
    } catch {}
    return new Set();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize remote counts on mount
  useEffect(() => {
    fetch(`/api/projects/${projectId}/reactions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.counts) {
          setCounts(data.counts);
        }
      })
      .catch(() => {});
  }, [projectId]);

  const handleToggle = async (reaction: ReactionType) => {
    if (isLoading) return;

    // Optimistic toggle
    const isCurrentlyActive = activeReactions.has(reaction);
    const nextActive = new Set(activeReactions);
    const nextCounts = { ...counts };

    if (isCurrentlyActive) {
      nextActive.delete(reaction);
      nextCounts[reaction] = Math.max(0, nextCounts[reaction] - 1);
    } else {
      nextActive.add(reaction);
      nextCounts[reaction] += 1;
    }

    setActiveReactions(nextActive);
    setCounts(nextCounts);

    try {
      localStorage.setItem(
        `showphan_peer_reactions_${projectId}`,
        JSON.stringify(Array.from(nextActive))
      );
    } catch {}

    // Send mutation to server
    try {
      setIsLoading(true);
      const res = await fetch(`/api/projects/${projectId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch {
      // Retain optimistic state gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const reactionKeys: ReactionType[] = [
    "mindblown",
    "cleanCode",
    "greatUi",
    "blazingFast",
  ];

  const githubDiscussionsUrl = repoUrl
    ? `${repoUrl.replace(/\/$/, "")}/discussions`
    : null;

  return (
    <div className="w-full py-4 border-y border-[var(--border)] bg-[var(--card)]/40 rounded-xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Reaction Pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mr-1">
          Peer Reactions:
        </span>
        {reactionKeys.map((key) => {
          const item = REACTION_DEFINITIONS[key];
          const isSelected = activeReactions.has(key);
          const count = counts[key] ?? 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleToggle(key)}
              title={item.description}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 select-none cursor-pointer ${
                isSelected
                  ? "bg-blue-500/10 border-blue-500/40 text-[#0052ff] font-bold shadow-sm shadow-blue-500/10 scale-105"
                  : "bg-white border-[var(--border)] text-[var(--foreground)] hover:border-blue-500/30 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm transition-transform duration-200 group-hover:scale-125">
                {item.emoji}
              </span>
              <span>{item.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? "bg-blue-500/20 text-[#0052ff]"
                    : "bg-slate-100 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Discuss on GitHub CTA */}
      {githubDiscussionsUrl && (
        <a
          href={githubDiscussionsUrl}
          target="_blank"
          rel="ugc nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 text-xs font-semibold transition-colors duration-200 shadow-sm shrink-0"
        >
          <svg
            className="w-4 h-4 fill-current text-zinc-400 group-hover:text-white"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>Discuss on GitHub</span>
          <span className="text-zinc-500">↗</span>
        </a>
      )}
    </div>
  );
}
