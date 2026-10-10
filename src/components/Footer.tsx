import React from "react";
import Link from "next/link";
import { WordmarkLogo } from "./WordmarkLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] mt-20 transition-colors">
      <div className="max-w-[1700px] mx-auto px-3.5 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-[var(--border)]">
          {/* Brand Column with Big Trophy Logo */}
          <div className="lg:col-span-2 space-y-4">
            <WordmarkLogo size="lg" />
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-sm leading-relaxed">
              Showphan is the open source developer showcase platform where engineers discover high velocity projects, verify engineering proofs, and elevate what they actually built.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/rajairfanahmed/showphan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-glass)] text-xs font-semibold text-[var(--foreground)] hover:border-amber-500/50 hover:text-amber-500 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Star on GitHub</span>
              </a>
              {/* v2.0 Beta badge without dot icon */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span>v2.0 Beta</span>
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Discover
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/" className="hover:text-amber-500 transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-amber-500 transition-colors">
                  Explore Showcases
                </Link>
              </li>
              <li>
                <Link href="/?sort=trending" className="hover:text-amber-500 transition-colors">
                  Trending Today
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-amber-500 transition-colors">
                  Developer Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bookmarks" className="hover:text-amber-500 transition-colors">
                  Inspiration Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/dashboard/new" className="hover:text-amber-500 transition-colors">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-amber-500 transition-colors">
                  How Showphan Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-500 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-500 transition-colors">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground-muted)]">
              <li>
                <a
                  href="https://github.com/rajairfanahmed/showphan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition-colors"
                >
                  GitHub Source Code
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition-colors"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar without dot icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground-muted)]">
          <p>
            © {new Date().getFullYear()} Showphan. Crafted with passion by{" "}
            <a
              href="https://rajairfanahmed.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-500 hover:text-amber-400 transition-colors underline decoration-transparent hover:decoration-current"
            >
              Raja Irfan Ahmed
            </a>
            .
          </p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
