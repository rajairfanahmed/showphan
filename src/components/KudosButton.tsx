"use client";

import { useState } from "react";
import { useSession, signIn } from "@/lib/auth-client";

interface KudosButtonProps {
  projectId: string;
  initialKudosCount?: number;
  initialHasGiven?: boolean;
  size?: "sm" | "md" | "lg";
}

export function KudosButton({
  projectId,
  initialKudosCount = 0,
  initialHasGiven = false,
  size = "md",
}: KudosButtonProps) {
  const { data: session } = useSession();
  const [kudosCount, setKudosCount] = useState(initialKudosCount);
  const [hasGiven, setHasGiven] = useState(initialHasGiven);
  const [loading, setLoading] = useState(false);
  const [bursting, setBursting] = useState(false);

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

    // Optimistic update
    const previousGiven = hasGiven;
    const previousCount = kudosCount;
    const nextGiven = !hasGiven;
    const nextCount = nextGiven
      ? previousCount + 1
      : Math.max(0, previousCount - 1);

    setHasGiven(nextGiven);
    setKudosCount(nextCount);
    if (nextGiven) {
      setBursting(true);
      setTimeout(() => setBursting(false), 500);
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/kudos`, {
        method: nextGiven ? "POST" : "DELETE",
      });
      if (!res.ok) {
        if (res.status === 409) {
          // Already voted
          setHasGiven(true);
        } else {
          // Revert
          setHasGiven(previousGiven);
          setKudosCount(previousCount);
        }
      } else {
        const data = await res.json();
        setHasGiven(data.given);
        setKudosCount(data.kudosCount);
      }
    } catch {
      // Revert on network failure
      setHasGiven(previousGiven);
      setKudosCount(previousCount);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-1"
      : size === "lg"
      ? "text-base px-5 py-2.5 gap-2"
      : "text-sm px-3.5 py-1.5 gap-1.5";

  return (
    <button
      onClick={handleClick}
      type="button"
      title={session?.user ? (hasGiven ? "Remove Kudos" : "Award Kudos") : "Sign in to give Kudos"}
      className={`relative inline-flex items-center justify-center rounded-lg border font-semibold transition-all duration-200 select-none cursor-pointer ${sizeClasses} ${
        hasGiven
          ? "border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/20"
          : "border-[var(--border)] bg-[var(--card)] hover:border-amber-500/40 hover:bg-amber-500/5 text-[var(--foreground)]"
      } ${bursting ? "scale-105" : "scale-100"}`}
    >
      {/* Amber Particle Burst Micro-Interaction */}
      {bursting && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="kudos-particle absolute w-1.5 h-1.5 rounded-full bg-amber-400" style={{ "--tx": "-16px", "--ty": "-18px" } as React.CSSProperties} />
          <span className="kudos-particle absolute w-1 h-1 rounded-full bg-amber-300" style={{ "--tx": "18px", "--ty": "-16px" } as React.CSSProperties} />
          <span className="kudos-particle absolute w-1.5 h-1.5 rounded-full bg-amber-500" style={{ "--tx": "0px", "--ty": "-24px" } as React.CSSProperties} />
          <span className="kudos-particle absolute w-1 h-1 rounded-full bg-yellow-400" style={{ "--tx": "-20px", "--ty": "4px" } as React.CSSProperties} />
          <span className="kudos-particle absolute w-1.5 h-1.5 rounded-full bg-amber-400" style={{ "--tx": "20px", "--ty": "4px" } as React.CSSProperties} />
        </span>
      )}

      <span
        className={`transition-transform duration-200 ${
          hasGiven ? "text-amber-400 scale-110" : "text-[var(--muted-foreground)] group-hover:text-amber-400"
        }`}
      >
        ★
      </span>
      <span className="font-mono">{kudosCount}</span>
      <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
        Kudos
      </span>
    </button>
  );
}
