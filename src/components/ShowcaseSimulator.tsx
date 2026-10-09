"use client";

import React, { useState } from "react";
import { ViewportSwitcher, ViewportMode } from "./ViewportSwitcher";
import { TechBadge } from "./TechBadge";

interface SampleProject {
  id: string;
  title: string;
  summary: string;
  role: string;
  learnings: string;
  technologies: { name: string; iconColor: string }[];
  accentColor: string;
  coverGrad: string;
  metrics: { label: string; value: string }[];
  sandboxDemoContent: {
    heading: string;
    description: string;
    stat1: { label: string; val: string };
    stat2: { label: string; val: string };
    codeSnippet: string;
  };
}

const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: "distributed-cache",
    title: "Distributed Cache Engine",
    summary:
      "High-throughput, in-memory caching daemon written in Rust with custom Raft consensus and sub-millisecond p99 latency.",
    role: "Lead Systems Architect: designed consensus log replication and Zero-Copy serialization protocol.",
    learnings:
      "Mastered asynchronous runtime scheduling, epoll networking patterns, and strict memory safety without garbage collection pauses.",
    technologies: [
      { name: "Rust", iconColor: "vscode-icons:file-type-rust" },
      { name: "Docker", iconColor: "logos:docker-icon" },
      { name: "Linux", iconColor: "logos:linux-tux" },
      { name: "C++", iconColor: "logos:c-plusplus" },
    ],
    accentColor: "from-amber-500/20 via-zinc-900 to-zinc-950",
    coverGrad: "bg-gradient-to-tr from-amber-500/25 via-zinc-900 to-black",
    metrics: [
      { label: "p99 Latency", value: "0.42ms" },
      { label: "Throughput", value: "2.4M ops/s" },
      { label: "Memory Overhead", value: "< 24MB" },
    ],
    sandboxDemoContent: {
      heading: "Raft Cluster Health: 5/5 Nodes Synchronized",
      description: "Active quorum consensus running with Zero-Copy Raft state machine.",
      stat1: { label: "Log Commit Index", val: "#849,210" },
      stat2: { label: "Heartbeat RTT", val: "1.2ms" },
      codeSnippet: `// Benchmark Execution Output
[INFO] Cluster state: LEADER (node-01)
[BENCH] 1,000,000 writes in 412ms -> 2,427,184 ops/sec
[STATUS] p50: 0.18ms | p99: 0.42ms | max: 0.89ms`,
    },
  },
  {
    id: "neural-search",
    title: "Neural Vector Search Engine",
    summary:
      "Scalable approximate nearest neighbor vector indexing engine powered by HNSW graph partitioning and AVX-512 vector acceleration.",
    role: "Full-Stack AI Engineer: implemented cosine similarity vector kernels and interactive React query workbench.",
    learnings:
      "Deep understanding of high-dimensional vector spaces, quantizing float32 embeddings, and streaming results with SSE.",
    technologies: [
      { name: "TypeScript", iconColor: "vscode-icons:file-type-typescript-official" },
      { name: "Next.js", iconColor: "logos:nextjs-icon" },
      { name: "Python", iconColor: "logos:python" },
      { name: "PostgreSQL", iconColor: "logos:postgresql" },
    ],
    accentColor: "from-cyan-500/20 via-zinc-900 to-zinc-950",
    coverGrad: "bg-gradient-to-tr from-cyan-500/25 via-zinc-900 to-black",
    metrics: [
      { label: "Recall Rate", value: "98.7%" },
      { label: "Index Scale", value: "10M Vectors" },
      { label: "Query Time", value: "2.1ms" },
    ],
    sandboxDemoContent: {
      heading: "HNSW Vector Topology: 128-dim Index Loaded",
      description: "Cosine distance indexing with Hierarchical Navigable Small World graphs.",
      stat1: { label: "EF Construction", val: "200" },
      stat2: { label: "Recall@10", val: "99.1%" },
      codeSnippet: `// Query Vector [0.421, -0.189, 0.992, ...]
Matched ID: #48109 (Similarity: 0.9842)
Matched ID: #10923 (Similarity: 0.9610)
Pipeline execution completed in 2.18ms`,
    },
  },
  {
    id: "showphan-v2",
    title: "Showphan Portfolio Platform V2",
    summary:
      "Product-of-the-Year developer showcase platform featuring live sandboxes, dynamic SVG badges, and peer reaction feedback loops.",
    role: "Solo Creator: architected end-to-end full-stack platform with zero heavy animation runtime dependencies.",
    learnings:
      "Engineered hardware-accelerated CSS micro-interactions, logarithmic momentum scoring, and high-contrast SVG badges.",
    technologies: [
      { name: "Next.js", iconColor: "logos:nextjs-icon" },
      { name: "React", iconColor: "logos:react" },
      { name: "TailwindCSS", iconColor: "logos:tailwindcss-icon" },
      { name: "PostgreSQL", iconColor: "logos:postgresql" },
    ],
    accentColor: "from-emerald-500/20 via-zinc-900 to-zinc-950",
    coverGrad: "bg-gradient-to-tr from-emerald-500/25 via-zinc-900 to-black",
    metrics: [
      { label: "Lighthouse Score", value: "100" },
      { label: "Bundle Weight", value: "0 KB Added" },
      { label: "Verification", value: "GitHub OAuth" },
    ],
    sandboxDemoContent: {
      heading: "Interactive Live Showcase Viewer Active",
      description: "Seamlessly test device viewports across Desktop, Tablet, and Mobile with HTML5 sandboxing.",
      stat1: { label: "Published Proofs", val: "100% Live" },
      stat2: { label: "Trending Decay", val: "Dynamic" },
      codeSnippet: `// Showphan Real-Time Quality Gate
✓ Project Title specified
✓ Summary under 140 chars
✓ 16:9 Cover Image attached
✓ Verified Tech Stack tagged
✓ Live URL with HTML5 sandbox isolation`,
    },
  },
];

export function ShowcaseSimulator() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("distributed-cache");
  const [activeTab, setActiveTab] = useState<"visual" | "sandbox">("sandbox");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  // Interactive peer reactions state for the simulator
  const [reactions, setReactions] = useState<Record<string, number>>({
    mindblown: 42,
    cleanCode: 38,
    greatUi: 57,
    blazingFast: 64,
  });
  const [userVoted, setUserVoted] = useState<Set<string>>(new Set(["mindblown"]));

  const activeProject =
    SAMPLE_PROJECTS.find((p) => p.id === selectedProjectId) || SAMPLE_PROJECTS[0];

  const handleToggleReaction = (type: string) => {
    const nextVotes = new Set(userVoted);
    const nextCounts = { ...reactions };

    if (nextVotes.has(type)) {
      nextVotes.delete(type);
      nextCounts[type] = Math.max(0, nextCounts[type] - 1);
    } else {
      nextVotes.add(type);
      nextCounts[type] = (nextCounts[type] || 0) + 1;
    }

    setUserVoted(nextVotes);
    setReactions(nextCounts);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Simulator Headline & Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-sm">
            ⚡
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              Interactive Showcase Simulator
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Experience the 16:9 visual proof and multi-device viewport switcher live.
            </p>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          {SAMPLE_PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProjectId(proj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {proj.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="rounded-2xl border border-[var(--border)] bg-zinc-950 p-4 sm:p-6 shadow-2xl space-y-6">
        {/* Top Controls: Mode Switcher & Viewport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "visual"
                  ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>16:9 Visual Proof</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "sandbox"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold"
                  : "text-zinc-400 hover:text-emerald-400"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Sandbox</span>
            </button>
          </div>

          {activeTab === "sandbox" && (
            <div className="flex items-center gap-3">
              <ViewportSwitcher current={viewport} onChange={setViewport} />
              <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                <span>Viewport:</span>
                <span className="text-amber-400 font-bold">{viewport}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stage Content */}
        {activeTab === "visual" ? (
          /* 16:9 Visual Proof Tab */
          <div className="space-y-6">
            <div
              className={`aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 ${activeProject.coverGrad} p-6 sm:p-10 flex flex-col justify-between relative shadow-2xl group`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white font-mono text-xs font-semibold backdrop-blur-md">
                  16:9 High-Definition Proof of Work
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Verified Engineering Proof
                </span>
              </div>

              <div className="space-y-3 max-w-2xl">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {activeProject.title}
                </h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-2 drop-shadow">
                  {activeProject.summary}
                </p>
              </div>

              {/* Performance Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-md">
                {activeProject.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">{m.label}</span>
                    <span className="text-sm sm:text-base font-bold text-amber-300 font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role & Learnings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Role & Architecture
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeProject.role}</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Engineering Insights
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeProject.learnings}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Live Sandbox Tab with Multi-Device Frame */
          <div
            className={`mx-auto transition-all duration-300 ease-out ${
              viewport === "desktop"
                ? "w-full"
                : viewport === "tablet"
                ? "w-full max-w-[768px]"
                : "w-full max-w-[375px]"
            }`}
          >
            {/* Browser Chrome Header */}
            <div className="bg-zinc-900 border border-b-0 border-zinc-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
              </div>

              <div className="flex-1 max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1 flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-mono truncate">
                <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">https://demo.showphan.com/{activeProject.id}</span>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
                {viewport}
              </div>
            </div>

            {/* Interactive Sandbox Simulated Content */}
            <div className="border border-zinc-800 rounded-b-xl overflow-hidden bg-zinc-900/90 p-6 sm:p-8 space-y-6 shadow-inner min-h-[380px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Interactive Live Node Online
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">HTML5 Sandbox Isolated</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {activeProject.sandboxDemoContent.heading}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {activeProject.sandboxDemoContent.description}
                  </p>
                </div>

                {/* Simulated Telemetry Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">
                      {activeProject.sandboxDemoContent.stat1.label}
                    </span>
                    <span className="text-sm font-bold font-mono text-amber-400 block">
                      {activeProject.sandboxDemoContent.stat1.val}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">
                      {activeProject.sandboxDemoContent.stat2.label}
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-400 block">
                      {activeProject.sandboxDemoContent.stat2.val}
                    </span>
                  </div>
                </div>

                {/* Console Log Terminal */}
                <div className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {activeProject.sandboxDemoContent.codeSnippet}
                </div>
              </div>

              {/* Sandbox Footer Bar */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>sandbox=&quot;allow-scripts allow-same-origin allow-forms&quot;</span>
                <span className="text-amber-400 font-semibold">Ready for production deployment</span>
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack Pills for Selected Project */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase mr-1">Stack:</span>
            {activeProject.technologies.map((t) => (
              <TechBadge key={t.name} name={t.name} iconName={t.iconColor} size="sm" />
            ))}
          </div>

          {/* Interactive Peer Reactions in Simulator */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 hidden sm:inline mr-1">React:</span>
            {[
              { key: "mindblown", emoji: "🚀", label: "Mindblown" },
              { key: "cleanCode", emoji: "💎", label: "Clean Code" },
              { key: "greatUi", emoji: "🎨", label: "Great UI" },
              { key: "blazingFast", emoji: "⚡", label: "Blazing Fast" },
            ].map((r) => {
              const count = reactions[r.key] || 0;
              const hasVoted = userVoted.has(r.key);
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleToggleReaction(r.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${
                    hasVoted
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold scale-105"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="hidden md:inline">{r.label}</span>
                  <span className="font-mono text-[10px] opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
