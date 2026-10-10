import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052ff] font-extrabold text-2xl flex items-center justify-center shadow-inner">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          The link you followed may be broken, unpublished, or the showcase might have moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
      >
        <span>Return to Discovery Feed</span>
        <span>→</span>
      </Link>
    </div>
  );
}
