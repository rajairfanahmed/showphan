"use client";

import React, { useState } from "react";
import { ViewportSwitcher, ViewportMode } from "./ViewportSwitcher";

interface LiveSandboxViewerProps {
  projectTitle: string;
  coverUrl?: string | null;
  sandboxUrl?: string | null;
  liveUrl?: string | null;
  sandboxEnabled?: boolean;
}

export function LiveSandboxViewer({
  projectTitle,
  coverUrl,
  sandboxUrl,
  liveUrl,
  sandboxEnabled = false,
}: LiveSandboxViewerProps) {
  // Determine effective sandbox URL
  const effectiveSandboxUrl = sandboxUrl || liveUrl;
  const canShowSandbox = Boolean(effectiveSandboxUrl && (sandboxEnabled || liveUrl));

  // Active tab: default to visual if coverUrl exists, otherwise sandbox if available
  const [activeTab, setActiveTab] = useState<"visual" | "sandbox">(
    coverUrl ? "visual" : "sandbox"
  );

  // Active viewport mode for sandbox frame
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  // Iframe refresh key
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Tab Bar: Visual Proof vs Live Sandbox */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          {coverUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "visual"
                  ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <svg
                className="w-4 h-4 text-[#0052ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>16:9 Visual Proof</span>
            </button>
          )}

          {canShowSandbox && (
            <button
              type="button"
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "sandbox"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold"
                  : "text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Sandbox</span>
            </button>
          )}
        </div>

        {/* Viewport Switcher & External Link (Visible when in Sandbox mode) */}
        {activeTab === "sandbox" && effectiveSandboxUrl && (
          <div className="flex items-center gap-2.5">
            <ViewportSwitcher current={viewport} onChange={setViewport} />

            <button
              type="button"
              onClick={handleRefresh}
              title="Reload sandbox preview"
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <a
              href={effectiveSandboxUrl}
              target="_blank"
              rel="ugc nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <span>Open in New Tab</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* Main Showcase Stage */}
      {activeTab === "visual" ? (
        /* 16:9 Visual Proof View */
        coverUrl ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-zinc-900 shadow-2xl relative group">
            <img
              src={coverUrl}
              alt={projectTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
              🖼️
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">No cover image uploaded</h3>
              <p className="text-xs text-zinc-500">This project does not have a 16:9 preview screenshot.</p>
            </div>
          </div>
        )
      ) : (
        /* Live Sandbox View with Multi-Device Frame */
        effectiveSandboxUrl && (
          <div className="w-full bg-zinc-950/80 rounded-2xl border border-zinc-800 p-3 sm:p-6 shadow-2xl transition-all duration-300">
            {/* Viewport Frame Container */}
            <div
              className={`mx-auto transition-all duration-300 ease-out ${
                viewport === "desktop"
                  ? "w-full"
                  : viewport === "tablet"
                  ? "w-full max-w-[768px]"
                  : "w-full max-w-[375px]"
              }`}
            >
              {/* Browser Chrome Top Bezel */}
              <div className="bg-zinc-900 border border-b-0 border-zinc-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                </div>

                <div className="flex-1 max-w-md mx-auto bg-zinc-950/80 border border-zinc-800 rounded-md px-3 py-1 flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-mono truncate">
                  <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{effectiveSandboxUrl}</span>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">
                  {viewport}
                </div>
              </div>

              {/* Sandboxed Iframe with Strict HTML5 Isolation */}
              <div className="relative border border-zinc-800 rounded-b-xl overflow-hidden bg-white shadow-inner">
                <iframe
                  key={refreshKey}
                  src={effectiveSandboxUrl}
                  title={`${projectTitle} Live Interactive Sandbox`}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-[580px] sm:h-[660px] bg-white border-0 block"
                />
              </div>

              {/* Security & Fallback Banner */}
              <div className="mt-3 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">🛡️</span>
                  <span>
                    Isolated in HTML5 Sandbox. If the site restricts embedding (X-Frame-Options), click{" "}
                    <a
                      href={effectiveSandboxUrl}
                      target="_blank"
                      rel="ugc nofollow noopener noreferrer"
                      className="text-[#0052ff] underline hover:underline font-medium"
                    >
                      Open in New Tab ↗
                    </a>
                  </span>
                </div>
                <span className="hidden sm:inline font-mono text-[10px] text-zinc-500">
                  sandbox=&quot;allow-scripts allow-same-origin allow-forms&quot;
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
