"use client";

import React, { useState } from "react";
import { QualityGateEvaluation } from "@/lib/projects/quality-gate";

interface StickyActionDockProps {
  status: "DRAFT" | "PUBLISHED";
  saving: boolean;
  lastSavedTime: string | null;
  qualityGate: QualityGateEvaluation;
  onSaveDraft: () => void;
  onPublish: () => void;
  onTogglePreview: () => void;
  isPreviewOpen: boolean;
}

export function StickyActionDock({
  status,
  saving,
  lastSavedTime,
  qualityGate,
  onSaveDraft,
  onPublish,
  onTogglePreview,
  isPreviewOpen,
}: StickyActionDockProps) {
  const [showGateDetails, setShowGateDetails] = useState(false);

  const canPublish = qualityGate.canPublish;

  return (
    <div className="sticky bottom-4 sm:bottom-6 z-40 max-w-3xl mx-auto w-full px-3 sm:px-4 pointer-events-auto">
      {/* Quality Gate Missing Checklist Popover */}
      {showGateDetails && !canPublish && (
        <div className="mb-2 p-3 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-2xl shadow-2xl animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--foreground)] uppercase tracking-wider text-[11px]">
              Quality Gate Requirements ({qualityGate.satisfiedCount}/{qualityGate.totalRules})
            </span>
            <button
              type="button"
              onClick={() => setShowGateDetails(false)}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs font-semibold p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            Showphan enforces a 5-rule standard before projects can be featured on public feeds:
          </p>
          <ul className="space-y-1 pt-1 font-mono text-[11px]">
            <li className={`flex items-center gap-2 ${qualityGate.rules.title ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground-muted)]"}`}>
              <span>{qualityGate.rules.title ? "✓" : "○"}</span>
              <span>Project Title provided</span>
            </li>
            <li className={`flex items-center gap-2 ${qualityGate.rules.summary ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground-muted)]"}`}>
              <span>{qualityGate.rules.summary ? "✓" : "○"}</span>
              <span>Punchy summary (under 140 characters)</span>
            </li>
            <li className={`flex items-center gap-2 ${qualityGate.rules.coverImage ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground-muted)]"}`}>
              <span>{qualityGate.rules.coverImage ? "✓" : "○"}</span>
              <span>Verified 16:9 Cover Image</span>
            </li>
            <li className={`flex items-center gap-2 ${qualityGate.rules.technologies ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground-muted)]"}`}>
              <span>{qualityGate.rules.technologies ? "✓" : "○"}</span>
              <span>At least 1 Technology tag</span>
            </li>
            <li className={`flex items-center gap-2 ${qualityGate.rules.links ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground-muted)]"}`}>
              <span>{qualityGate.rules.links ? "✓" : "○"}</span>
              <span>At least 1 link (Live App or Repository)</span>
            </li>
          </ul>
        </div>
      )}

      {/* Floating Glassmorphic Pill Dock */}
      <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-2xl shadow-2xl transition-all">
        {/* Left Side: Status & Autosave Feedback */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pl-1.5 sm:pl-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase ${
              status === "PUBLISHED"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-500/10 border border-blue-500/25 text-[#0052ff] dark:text-blue-300"
            }`}
          >
            {status}
          </span>

          {/* Autosave Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--foreground-muted)] truncate font-mono">
            {saving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="truncate">Saving draft...</span>
              </>
            ) : lastSavedTime ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate hidden sm:inline">Saved at {lastSavedTime}</span>
                <span className="truncate sm:hidden">Saved</span>
              </>
            ) : (
              <span className="truncate">Draft initialized</span>
            )}
          </div>
        </div>

        {/* Right Side: Preview, Save Draft, Publish */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Toggle Live Preview Drawer Button */}
          <button
            type="button"
            onClick={onTogglePreview}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPreviewOpen
                ? "border-[#0052ff] bg-blue-500/15 text-[#0052ff] dark:text-blue-300"
                : "border-[var(--border)] hover:bg-[var(--surface-muted)] text-[var(--foreground)]"
            }`}
            title="Preview how card looks in feed"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Explicit Save Draft Button */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] bg-[var(--surface-muted)] hover:bg-[var(--surface-glass)] text-[var(--foreground)] hover:border-[#0052ff]/40 transition-all cursor-pointer"
          >
            <span>Save</span>
          </button>

          {/* Publish / Update Live Primary Action */}
          <button
            type="button"
            onClick={() => {
              if (canPublish) {
                onPublish();
              } else {
                setShowGateDetails((prev) => !prev);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              canPublish
                ? "bg-[#0052ff] hover:bg-blue-600 text-white active:scale-95 shadow-blue-500/25"
                : "bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
            }`}
          >
            <span>{status === "PUBLISHED" ? "Update Live" : "Publish"}</span>
            {!canPublish && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px] font-mono">
                {qualityGate.satisfiedCount}/{qualityGate.totalRules}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
