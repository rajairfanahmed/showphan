"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface VoteControlProps {
  projectId: string;
  initialVoteCount?: number;
  initialVoteState?: "up" | "down" | null;
}

export function VoteControl({
  projectId,
  initialVoteCount = 342,
  initialVoteState = null,
}: VoteControlProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [voteState, setVoteState] = useState<"up" | "down" | null>(initialVoteState);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (voteState === "up") {
      setVoteState(null);
      setVoteCount((prev) => prev - 1);
    } else {
      const delta = voteState === "down" ? 2 : 1;
      setVoteState("up");
      setVoteCount((prev) => prev + delta);
    }

    fetch(`/api/projects/${projectId}/kudos`, { method: "POST" }).catch(() => {});
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (voteState === "down") {
      setVoteState(null);
      setVoteCount((prev) => prev + 1);
    } else {
      const delta = voteState === "up" ? 2 : 1;
      setVoteState("down");
      setVoteCount((prev) => Math.max(0, prev - delta));
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-glass)] p-0.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--border-hover)]">
      {/* Upvote Button (lightweight, snappy animation) */}
      <motion.button
        type="button"
        onClick={handleUpvote}
        whileTap={{ scale: 0.92 }}
        title="Upvote"
        className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md transition-colors cursor-pointer ${
          voteState === "up"
            ? "bg-blue-500/15 text-[#0052ff] dark:text-blue-400 font-bold"
            : "hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)]"
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 ${voteState === "up" ? "text-[#0052ff] dark:text-blue-400" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="font-mono">{voteCount}</span>
      </motion.button>

      <span className="w-px h-3 bg-[var(--border)] mx-0.5" />

      {/* Downvote Button */}
      <motion.button
        type="button"
        onClick={handleDownvote}
        whileTap={{ scale: 0.92 }}
        title="Downvote"
        className={`px-1 py-0.5 sm:px-1.5 sm:py-1 rounded-md transition-colors cursor-pointer ${
          voteState === "down"
            ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 font-bold"
            : "hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)]"
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 ${voteState === "down" ? "text-rose-500 dark:text-rose-400" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
    </div>
  );
}
