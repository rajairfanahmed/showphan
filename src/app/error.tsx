"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client runtime error with digest
    console.error("[Showphan Client Error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-extrabold text-2xl flex items-center justify-center">
        500
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          An unexpected application error occurred. Our observability systems have been notified.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-[var(--muted-foreground)]/70">
            Digest: {error.digest}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--foreground)] border border-white/10 text-sm font-semibold transition-all"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
