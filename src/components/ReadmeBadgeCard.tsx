"use client";

import { useState } from "react";

interface ReadmeBadgeCardProps {
  slug: string;
}

export function ReadmeBadgeCard({ slug }: ReadmeBadgeCardProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";
  const badgeImageUrl = `${siteUrl}/api/badge/${slug}`;
  const profileUrl = `${siteUrl}/${slug}`;
  const markdownSnippet = `[![Showphan Showcase](${badgeImageUrl})](${profileUrl})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy badge snippet", err);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-lg">★</span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
              GitHub Profile README Badge
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Proof of Work
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl">
            Embed your live-updating proof-of-work card into your GitHub profile README. Updates automatically as you publish new projects and earn kudos.
          </p>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className={`self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
            copied
              ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
              : "bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-500/20 active:scale-95"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Live Badge Preview */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          Live Card Preview
        </span>
        <div className="p-4 sm:p-6 rounded-xl border border-[var(--border)] bg-zinc-950 flex items-center justify-center overflow-x-auto">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to view public profile"
            className="group block"
          >
            <img
              src={`/api/badge/${slug}`}
              alt={`${slug}'s Showphan Showcase Badge`}
              width={480}
              height={160}
              className="w-full max-w-[480px] rounded-xl border border-zinc-800 shadow-xl group-hover:border-amber-500/40 transition-colors"
            />
          </a>
        </div>
      </div>

      {/* Markdown Snippet Code Box */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          Markdown Snippet
        </span>
        <div className="relative rounded-xl border border-[var(--border)] bg-[var(--background)] p-3.5 font-mono text-xs text-amber-400 break-all overflow-x-auto selection:bg-amber-500/30">
          <code>{markdownSnippet}</code>
        </div>
      </div>
    </section>
  );
}
