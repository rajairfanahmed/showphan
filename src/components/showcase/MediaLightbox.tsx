"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MediaLightboxProps {
  src: string | null;
  alt: string;
  title: string;
}

export function MediaLightbox({ src, alt, title }: MediaLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!src) {
    return (
      <div className="aspect-video w-full rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-50/50 via-white to-slate-50 flex flex-col items-center justify-center p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#0052ff] flex items-center justify-center text-3xl font-black mb-3">
          ⚡
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
        <p className="text-xs text-[var(--foreground-muted)] max-w-sm mt-1">
          No cover image uploaded. Review the technical write-up and live application links below.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 16:9 Pristine Media Showcase Canvas */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative aspect-video w-full rounded-3xl overflow-hidden border border-[var(--border)] bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />

        {/* Hover Zoom Prompt Badge */}
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 shadow-lg">
          <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <span>Click to expand 16:9 media</span>
        </div>
      </div>

      {/* Full-Screen Modal Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold backdrop-blur-md transition-colors cursor-pointer"
            title="Close lightbox (Esc)"
          >
            ✕
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-[96vw] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black"
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[95vw] w-auto h-auto object-contain select-none"
            />
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-medium flex items-center justify-between">
              <span className="truncate pr-4">{title} — Pristine 16:9 Showcase</span>
              <span className="text-white/60 font-mono text-[11px] shrink-0">Press ESC to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
