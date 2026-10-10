export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 flex-1">
      <div className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          How Showphan Works
        </h1>
        <p className="text-base text-[var(--muted-foreground)]">
          Three simple steps to build and share your developer proof of work.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm space-y-3">
          <div className="text-[#0052ff] font-bold text-xs uppercase tracking-wider font-mono">Step 1</div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Sign in with your public GitHub account</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            We authenticate using GitHub OAuth with minimal read-only public profile scope. Your numeric GitHub ID binds your account, and your current username sets your permanent profile address (<code className="text-[#0052ff] font-mono">showphan.vercel.app/yourname</code>).
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm space-y-3">
          <div className="text-[#0052ff] font-bold text-xs uppercase tracking-wider font-mono">Step 2</div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Add your projects with the 5-minute form</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Upload a 16:9 screenshot, pick your technologies with official brand icons, add live and repository links, and describe your architectural decisions. Our live side-by-side preview shows you exactly how visitors will see your card.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm space-y-3">
          <div className="text-[#0052ff] font-bold text-xs uppercase tracking-wider font-mono">Step 3</div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Share one clean link</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Put your Showphan link in your resume header, your LinkedIn profile, and your outreach emails. Links shared on WhatsApp and Twitter generate instant high-resolution cards with your project&apos;s cover image.
          </p>
        </div>
      </div>
    </div>
  );
}
