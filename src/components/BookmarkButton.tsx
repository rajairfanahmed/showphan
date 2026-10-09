"use client";

import { useState } from "react";
import { useSession, signIn } from "@/lib/auth-client";

interface BookmarkButtonProps {
  projectId: string;
  initialBookmarked?: boolean;
  size?: "sm" | "md";
}

export function BookmarkButton({
  projectId,
  initialBookmarked = false,
  size = "md",
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      await signIn.social({
        provider: "github",
        callbackURL: window.location.pathname,
      });
      return;
    }

    if (loading) return;

    // Optimistic toggle
    const previous = bookmarked;
    const next = !bookmarked;
    setBookmarked(next);
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/bookmark`, {
        method: next ? "POST" : "DELETE",
      });

      if (!res.ok) {
        setBookmarked(previous);
      } else {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch {
      setBookmarked(previous);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses =
    size === "sm" ? "p-1.5 rounded-lg" : "p-2 rounded-lg";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-4 h-4";

  return (
    <button
      onClick={handleClick}
      type="button"
      title={
        session?.user
          ? bookmarked
            ? "Remove from Inspiration Vault"
            : "Save to Inspiration Vault"
          : "Sign in to bookmark"
      }
      className={`inline-flex items-center justify-center border transition-all duration-200 select-none cursor-pointer ${sizeClasses} ${
        bookmarked
          ? "border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/20"
          : "border-[var(--border)] bg-[var(--card)] hover:border-amber-500/40 hover:bg-amber-500/5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      }`}
    >
      <svg
        className={`${iconSize} transition-transform duration-200 ${
          bookmarked ? "scale-110 fill-current text-amber-400" : "fill-none text-current"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={bookmarked ? 2 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
