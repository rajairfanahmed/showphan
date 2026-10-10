"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";

export default function NewProjectPage() {
  const { data: session, isPending } = useSession();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [isSlow, setIsSlow] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Only attempt creation once session is resolved and user exists
    if (isPending || !session?.user || hasTriggeredRef.current) return;

    hasTriggeredRef.current = true;
    setIsCreating(true);
    setErrorMsg(null);

    const slowTimer = setTimeout(() => {
      setIsSlow(true);
    }, 3500);

    async function createDraft() {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Untitled Project" }),
        });

        clearTimeout(slowTimer);

        if (res.ok) {
          const data = await res.json();
          const projId = data.project?.id;
          if (projId) {
            setCreatedProjectId(projId);
            // Use window.location.replace for guaranteed browser navigation
            window.location.replace(`/dashboard/project/${projId}/edit`);
          } else {
            setErrorMsg("Project draft created, but no ID was returned.");
            setIsCreating(false);
            hasTriggeredRef.current = false;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMsg(
            errData.error?.message ||
              "Failed to initialize a new project draft. Please try again."
          );
          setIsCreating(false);
          hasTriggeredRef.current = false;
        }
      } catch {
        clearTimeout(slowTimer);
        setErrorMsg("Network error initializing project. Please check your connection.");
        setIsCreating(false);
        hasTriggeredRef.current = false;
      }
    }

    createDraft();

    return () => {
      clearTimeout(slowTimer);
    };
  }, [session, isPending]);

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard/new",
      });
    } catch (e) {
      console.error("Sign in failed:", e);
    }
  };

  const handleRetry = () => {
    setErrorMsg(null);
    setIsCreating(false);
    hasTriggeredRef.current = false;
    setIsSlow(false);
  };

  // State 1: Session loading
  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center py-28 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-[var(--foreground-muted)]">Verifying session...</p>
        </div>
      </div>
    );
  }

  // State 2: Unauthenticated - Clear sign-in prompt instead of bouncing
  if (!session?.user) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white/80 dark:bg-white/90 backdrop-blur-md p-8 sm:p-10 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052ff] flex items-center justify-center mx-auto text-2xl shadow-inner">
            🚀
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#0c0d12] tracking-tight">
              Submit Your Project
            </h1>
            <p className="text-sm text-[#555a6d] leading-relaxed">
              Sign in with your GitHub account to create and manage project showcases, add cover images, and publish to the live feed.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
            >
              ← Back to Discovery Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Creation Error
  if (errorMsg) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white/90 p-8 shadow-xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl font-bold border border-red-100">
            ⚠️
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[#0c0d12]">Draft Initialization Issue</h2>
            <p className="text-xs text-[#555a6d] leading-relaxed">{errorMsg}</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-[#0052ff] text-white text-xs font-bold hover:bg-blue-600 shadow-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Draft Created, Navigating
  if (createdProjectId) {
    return (
      <div className="flex-1 flex items-center justify-center py-28 px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg font-bold">
            ✓
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-[var(--foreground)]">Draft Created!</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Opening Project Studio... If not redirected automatically:
            </p>
          </div>
          <a
            href={`/dashboard/project/${createdProjectId}/edit`}
            className="px-5 py-2.5 rounded-xl bg-[#0052ff] text-white text-xs font-bold hover:bg-blue-600 shadow-md transition-all"
          >
            Open Project Studio →
          </a>
        </div>
      </div>
    );
  }

  // State 5: Initializing Draft
  return (
    <div className="flex-1 flex items-center justify-center py-28 px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <div className="w-9 h-9 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-[var(--foreground)]">Creating project draft...</p>
        {isSlow && (
          <p className="text-xs text-[var(--foreground-muted)] animate-fade-in">
            Connecting to cloud database... Almost ready.
          </p>
        )}
      </div>
    </div>
  );
}
