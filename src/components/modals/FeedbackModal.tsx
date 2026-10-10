"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<"idea" | "bug" | "praise">("idea");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setText("");
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-lg sm:text-xl">💬</span>
              <h3 className="font-bold text-base sm:text-lg text-[var(--foreground)]">Developer Feedback</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-3xl">🎉</span>
              <p className="font-bold text-[var(--foreground)] text-base">Thank you for shaping Showphan!</p>
              <p className="text-xs text-[var(--foreground-muted)]">Your feedback helps make this platform better for all developers.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 rounded-xl bg-[var(--surface-glass)] border border-[var(--border)]">
                {(
                  [
                    { id: "idea", label: "💡 Feature" },
                    { id: "bug", label: "🐛 Bug" },
                    { id: "praise", label: "❤️ Praise" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFeedbackType(t.id)}
                    className={`py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer truncate ${
                      feedbackType === t.id
                        ? "bg-[#0052ff] text-white shadow-sm font-bold"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-glass)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
                  What&apos;s on your mind?
                </label>
                <textarea
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us what you'd love to see or what we can improve..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] p-3 text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-[#0052ff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
