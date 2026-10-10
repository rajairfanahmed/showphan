"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    const updateProgress = (scrollY: number) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const p = (scrollY / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, p)));
      }
    };

    // 1. Lenis live scroll event (fires on every tick of smooth scrolling)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lenis.on("scroll", (e: any) => {
      if (typeof e.progress === "number") {
        setScrollProgress(Math.min(100, Math.max(0, e.progress * 100)));
      } else if (typeof e.scroll === "number") {
        updateProgress(e.scroll);
      }
    });

    // 2. Native window scroll event fallback
    const handleNativeScroll = () => {
      updateProgress(window.scrollY);
    };

    window.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleNativeScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Top Reading Progress Bar (Live updating with zero delay) */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[100] pointer-events-none bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        style={{
          width: `${scrollProgress}%`,
          opacity: scrollProgress > 0.2 ? 1 : 0,
        }}
      />
      {children}
    </>
  );
}
