"use client";

import React, { useState } from "react";

interface TagTokenizerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  disabled?: boolean;
}

export function TagTokenizer({
  tags,
  onChange,
  maxTags = 5,
  disabled = false,
}: TagTokenizerProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (rawText: string) => {
    let clean = rawText.trim().replace(/^#+/, ""); // strip any leading '#'
    clean = clean.replace(/[^a-zA-Z0-9_-]/g, ""); // strip invalid characters

    if (!clean) return;
    const formattedTag = `#${clean.toLowerCase()}`;

    // Prevent duplicates and respect 5-tag max limit
    if (tags.includes(formattedTag)) {
      setInputValue("");
      return;
    }

    if (tags.length >= maxTags) {
      setInputValue("");
      return;
    }

    onChange([...tags, formattedTag]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      // Remove last tag on backspace
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) return;
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const isAtLimit = tags.length >= maxTags;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[var(--foreground)]">
          Tags <span className="text-xs text-[var(--foreground-muted)] font-normal">(Optional discovery labels)</span>
        </label>
        <span
          className={`text-xs font-mono font-medium ${
            isAtLimit ? "text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--foreground-muted)]"
          }`}
        >
          {tags.length} / {maxTags} tags
        </span>
      </div>

      <div
        className={`flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus-within:border-[#0052ff] focus-within:ring-2 focus-within:ring-[#0052ff]/20 transition-all ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Rendered #Tag Badges */}
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/25 text-[#0052ff] dark:text-blue-400 select-none animate-fade-in"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              disabled={disabled}
              className="text-blue-500/60 hover:text-red-500 dark:text-blue-300/60 dark:hover:text-red-400 transition-colors p-0.5 rounded cursor-pointer"
              title={`Remove ${tag}`}
              aria-label={`Remove ${tag}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        {/* Inline Input Field */}
        {!isAtLimit && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue && addTag(inputValue)}
            placeholder={tags.length === 0 ? "Type tag and press Enter or comma (e.g. ai, web3, productivity)..." : "Add another tag..."}
            disabled={disabled || isAtLimit}
            className="flex-1 min-w-[160px] bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none py-1 px-1 font-mono"
          />
        )}
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)]">
        Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-[10px] border border-[var(--border)]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--foreground)] font-mono text-[10px] border border-[var(--border)]">,</kbd> to add tags. Up to {maxTags} tags per showcase.
      </p>
    </div>
  );
}
