"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    displayName?: string | null;
    slug: string;
    bio?: string | null;
    avatarUrl?: string | null;
    createdAt?: Date | string;
  };
  publishedCount: number;
  totalKudos: number;
}

export function ProfileHeader({
  user,
  publishedCount,
  totalKudos,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const authorName = user.displayName || user.name || user.slug;

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <section className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Avatar */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 border-2 border-blue-500/25 bg-white shadow-md shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={authorName}
              fill
              sizes="112px"
              className="rounded-[22px] object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-[22px] bg-[#0052ff] text-white font-black text-3xl flex items-center justify-center">
              {authorName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Identity & Metadata Details */}
        <div className="flex-1 space-y-3 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0c0d12] tracking-tight">
                  {authorName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052ff] border border-blue-100 text-[11px] font-bold">
                  Verified Builder
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#0052ff] mt-0.5">
                @{user.slug}
              </p>
            </div>

            {/* Share Portfolio Action */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] bg-white hover:bg-slate-50 text-xs font-bold text-[#0c0d12] hover:text-[#0052ff] transition-all shadow-sm cursor-pointer self-center sm:self-start"
            >
              <span>{copied ? "✓ Copied to clipboard!" : "🔗 Share Portfolio"}</span>
            </button>
          </div>

          {/* Technical Bio */}
          <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
            {user.bio || "Full-stack developer building projects that solve real problems."}
          </p>

          {/* Proof-of-Work Badges Row */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50/60 text-[#0052ff] text-xs font-bold font-mono shadow-sm">
              <span>★</span>
              <span>{totalKudos} Community Kudos</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] text-xs font-semibold shadow-sm">
              <span>🚀</span>
              <span>{publishedCount} {publishedCount === 1 ? "Showcase" : "Showcases"} Published</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
