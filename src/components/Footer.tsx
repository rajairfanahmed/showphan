import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-[var(--foreground)]">
              Showphan
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              — Free & Open Source developer showcase
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">MIT License</a>. Architected & Crafted by{" "}
            <a href="https://rajairfanahmed.vercel.app" target="_blank" rel="noopener noreferrer" className="underline font-medium text-amber-500 hover:text-amber-400">
              Raja Irfan Ahmed
            </a>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]">
          <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
            About
          </Link>
          <Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">
            How it works
          </Link>
          <Link href="/faq" className="hover:text-[var(--foreground)] transition-colors">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
            Terms
          </Link>
          <a
            href="https://github.com/rajairfanahmed/showphan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
