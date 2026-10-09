"use client";

import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";
import { TechBadge } from "@/components/TechBadge";

export default function HomePage() {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden border-b border-[var(--border)]">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs sm:text-sm font-semibold tracking-wide">
            <span>✨ The Open-Source Developer Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1]">
            A platform built to highlight your skills and achievements to the world.
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed">
            GitHub shows code. LinkedIn shows bullet points. Showphan gives you one polished, high-impact link that shows what you actually built.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all min-touch"
              >
                <span>Go to Dashboard</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={handleSignIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all min-touch"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Sign in with GitHub</span>
              </button>
            )}

            <Link
              href="/rajairfanahmed"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-base transition-colors min-touch"
            >
              <span>See a live profile</span>
              <span className="text-amber-500">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Profile Example Showcase */}
      <section className="py-20 border-b border-[var(--border)] bg-[var(--card)]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Show the projects that move your career forward.
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-sm sm:text-base">
              Every project comes alive with crisp 16:9 previews, verified tech stacks with icons, live links, and what you learned.
            </p>
          </div>

          {/* Example Card Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Card 1 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-200 group flex flex-col">
              <div className="aspect-video w-full bg-gradient-to-tr from-amber-500/20 via-zinc-900 to-zinc-800 flex items-center justify-center relative overflow-hidden">
                <span className="text-amber-400 font-mono text-sm font-semibold tracking-wider uppercase">
                  16:9 Cover Image
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                    Distributed Cache Engine
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    High-throughput, in-memory caching daemon written in Rust with custom Raft consensus.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <TechBadge name="Rust" iconName="logos:rust" size="sm" />
                  <TechBadge name="Docker" iconName="logos:docker-icon" size="sm" />
                  <TechBadge name="Redis" iconName="logos:redis" size="sm" />
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-200 group flex flex-col">
              <div className="aspect-video w-full bg-gradient-to-tr from-blue-500/20 via-zinc-900 to-zinc-800 flex items-center justify-center relative overflow-hidden">
                <span className="text-blue-400 font-mono text-sm font-semibold tracking-wider uppercase">
                  16:9 Cover Image
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                    Autonomous Agent Studio
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    Visual workflow builder for orchestrating multi-agent systems with live streaming debuggers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <TechBadge name="Next.js" iconName="logos:nextjs-icon" size="sm" />
                  <TechBadge name="TypeScript" iconName="logos:typescript-icon" size="sm" />
                  <TechBadge name="Tailwind CSS" iconName="logos:tailwindcss-icon" size="sm" />
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-200 group flex flex-col md:col-span-2 lg:col-span-1">
              <div className="aspect-video w-full bg-gradient-to-tr from-emerald-500/20 via-zinc-900 to-zinc-800 flex items-center justify-center relative overflow-hidden">
                <span className="text-emerald-400 font-mono text-sm font-semibold tracking-wider uppercase">
                  16:9 Cover Image
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                    PostgreSQL Observability Exporter
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    Lightweight exporter tracking lock contention and buffer cache hit rates in real-time.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <TechBadge name="Go" iconName="logos:go" size="sm" />
                  <TechBadge name="PostgreSQL" iconName="logos:postgresql" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Build your developer portfolio, one project at a time.
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-lg mx-auto text-sm sm:text-base">
              Add a complete project in about 5 minutes. No tedious static site generator setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-lg text-[var(--foreground)]">Sign in with GitHub</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                One-click sign-in using your public profile. We claim your immutable slug once so your links never break.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-lg text-[var(--foreground)]">Add your projects</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Guided form with live split-screen preview, offline technology icon selectors, and a strict Quality Gate checklist.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-lg text-[var(--foreground)]">Share one link</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Send your clean link on WhatsApp, LinkedIn, or resume. Renders rich, instant OpenGraph previews everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visitor CTA Banner */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Ready to bring your hidden work into the light?
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            Free forever, open source, and built for developers by developers.
          </p>
          <button
            onClick={handleSignIn}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            Create your free profile now
          </button>
        </div>
      </section>
    </div>
  );
}
