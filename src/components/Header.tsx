"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "./ThemeToggle";
import { GitHubStarWidget } from "./GitHubStarWidget";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const userSlug = (session?.user as { slug?: string } | undefined)?.slug || session?.user?.name?.toLowerCase().replace(/\s+/g, "") || "profile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & v1 Tag */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
              Showphan
            </span>
          </Link>
          <a
            href="https://github.com/rajairfanahmed/showphan/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
          >
            v1.0
          </a>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-[var(--foreground)] hover:text-amber-500 transition-colors"
          >
            <span className="text-amber-400">★</span>
            <span>Explore</span>
          </Link>
          <Link
            href="/how-it-works"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            How it works
          </Link>
        </nav>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live GitHub Star Widget with Creator Portfolio Attribution */}
          <GitHubStarWidget variant="compact" showCreator={true} />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth State */}
          {isPending ? (
            <div className="w-24 h-9 bg-[var(--muted)] animate-pulse rounded-md" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors focus:ring-2 focus:ring-amber-500/50"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-semibold text-xs flex items-center justify-center">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]">
                  {session.user.name || "Developer"}
                </span>
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl py-1 z-50"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={`/${userSlug}`}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    View Public Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookmarks"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    Inspiration Vault 🔖
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-[var(--border)] my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[var(--muted)] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm shadow-md hover:shadow-amber-500/20 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Sign in with GitHub</span>
            </button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Link
              href="/dashboard"
              className="p-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-500"
            >
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">
                  {session.user.name?.[0] || "D"}
                </div>
              )}
            </Link>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-3 py-1.5 rounded-md bg-amber-500 text-black font-semibold text-xs"
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            aria-label="Open mobile menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 space-y-2">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-amber-500"
          >
            <span>★</span>
            <span>Explore Projects</span>
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[var(--foreground)]"
          >
            How it works
          </Link>
          <div className="border-t border-[var(--border)] pt-1" />
          {session?.user && (
            <>
              <Link href={`/${userSlug}`} className="block py-2 text-sm font-medium text-[var(--foreground)]">
                Public Profile
              </Link>
              <Link href="/dashboard" className="block py-2 text-sm font-medium text-[var(--foreground)]">
                Dashboard
              </Link>
              <Link href="/dashboard/bookmarks" className="block py-2 text-sm font-medium text-[var(--foreground)]">
                Inspiration Vault 🔖
              </Link>
              <Link href="/settings" className="block py-2 text-sm font-medium text-[var(--foreground)]">
                Settings
              </Link>
              <div className="border-t border-[var(--border)] pt-2" />
            </>
          )}
          <a
            href="https://github.com/rajairfanahmed/showphan"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-sm text-[var(--foreground)] flex items-center justify-between"
          >
            <span>Star on GitHub</span>
            <span className="text-amber-500">★</span>
          </a>
          <a
            href="https://github.com/rajairfanahmed"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-sm text-[var(--muted-foreground)]"
          >
            Owner&apos;s GitHub
          </a>
          {session?.user && (
            <button
              onClick={handleSignOut}
              className="block w-full text-left py-2 text-sm text-red-400"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
