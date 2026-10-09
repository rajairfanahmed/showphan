import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-extrabold text-2xl flex items-center justify-center">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          The link you followed may be broken, unpublished, or the profile may not exist.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all"
      >
        <span>Return to Home</span>
        <span>→</span>
      </Link>
    </div>
  );
}
