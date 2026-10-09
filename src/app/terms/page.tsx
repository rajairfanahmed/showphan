export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 flex-1">
      <div className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-[var(--foreground)] leading-relaxed">
        <h2 className="text-lg font-bold">1. Terms of Use</h2>
        <p>
          Showphan is provided &quot;as is&quot; and &quot;as available&quot; under the MIT License. By using the platform, you agree not to upload abusive, copyrighted, or malicious material.
        </p>

        <h2 className="text-lg font-bold">2. User Content & External Links</h2>
        <p>
          You retain full ownership of the project descriptions and screenshots you submit. External links submitted by developers are user-generated content and are flagged with <code>rel=&quot;ugc nofollow&quot;</code>. Showphan does not endorse external destination websites.
        </p>

        <h2 className="text-lg font-bold">3. Availability</h2>
        <p>
          Showphan runs on cloud infrastructure free tiers. While we endeavor to maintain consistent availability, no service level agreements or uptime warranties are guaranteed.
        </p>
      </div>
    </div>
  );
}
