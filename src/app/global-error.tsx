"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Showphan Fatal Root Error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 antialiased">
        <div className="max-w-md text-center space-y-6 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-extrabold text-2xl flex items-center justify-center">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">System Exception</h1>
            <p className="text-sm text-slate-400">
              A critical error occurred while rendering the application root.
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 inline-block">
                Digest: {error.digest}
              </p>
            )}
          </div>
          <div>
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow transition-all cursor-pointer"
            >
              Reload application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
