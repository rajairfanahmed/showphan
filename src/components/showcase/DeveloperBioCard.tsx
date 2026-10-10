import React from "react";
import Link from "next/link";
import Image from "next/image";

interface DeveloperBioCardProps {
  author: {
    id: string;
    slug: string;
    name?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  totalKudos?: number;
  publishedCount?: number;
}

export function DeveloperBioCard({
  author,
  totalKudos = 0,
  publishedCount = 1,
}: DeveloperBioCardProps) {
  const authorName = author.displayName || author.name || author.slug;

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Author Avatar & Identifiers */}
        <div className="flex items-center gap-4">
          <Link href={`/${author.slug}`} className="shrink-0 group">
            {author.avatarUrl ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[var(--border)] group-hover:border-[#0052ff] transition-colors shadow-sm bg-gray-100">
                <Image
                  src={author.avatarUrl}
                  alt={authorName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 text-[#0052ff] flex items-center justify-center text-xl font-black group-hover:border-[#0052ff] transition-colors shadow-sm">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/${author.slug}`}
                className="text-lg font-black text-[var(--foreground)] hover:text-[#0052ff] transition-colors tracking-tight"
              >
                {authorName}
              </Link>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0052ff] border border-blue-500/20 text-[10px] font-bold">
                Creator
              </span>
            </div>
            <p className="text-xs font-mono text-[var(--foreground-muted)]">
              @{author.slug}
            </p>
          </div>
        </div>

        {/* View Profile Button */}
        <Link
          href={`/${author.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-slate-50 hover:border-[#0052ff] text-xs font-bold text-[var(--foreground)] hover:text-[#0052ff] transition-all shadow-sm"
        >
          <span>View Developer Portfolio</span>
          <span>→</span>
        </Link>
      </div>

      {/* Bio */}
      {author.bio && (
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed border-t border-[var(--border)]/60 pt-4">
          {author.bio}
        </p>
      )}

      {/* Proof-of-work Stats Strip */}
      <div className="flex items-center gap-4 text-xs font-mono text-[var(--foreground-muted)] border-t border-[var(--border)]/60 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[#0052ff] font-bold">★ {totalKudos}</span>
          <span>Community Kudos</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[var(--foreground)]">{publishedCount}</span>
          <span>Showcase{publishedCount === 1 ? "" : "s"} Published</span>
        </div>
      </div>
    </div>
  );
}
