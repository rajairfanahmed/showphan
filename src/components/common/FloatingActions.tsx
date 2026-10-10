"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedbackModal } from "../modals/FeedbackModal";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-20 lg:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
        {/* Scroll To Top "Going up" Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              title="Going up (scroll to top)"
              aria-label="Scroll to top"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--card)]/90 backdrop-blur-md text-[var(--foreground)] border border-[var(--border)] shadow-xl hover:border-amber-500/50 hover:text-amber-500 transition-colors cursor-pointer group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Feedback Button (responsive pill on desktop, compact circular floating icon on mobile) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFeedbackOpen(true)}
          title="Developer feedback"
          aria-label="Developer feedback"
          className="flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-[var(--card)]/95 backdrop-blur-md text-[var(--foreground)] border border-[var(--border)] shadow-xl hover:border-amber-500/50 hover:text-amber-500 transition-all text-xs font-semibold cursor-pointer group"
        >
          <svg className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="hidden sm:inline">Feedback</span>
        </motion.button>
      </div>

      {/* Developer Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
