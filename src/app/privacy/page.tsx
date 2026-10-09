export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 flex-1">
      <div className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-[var(--foreground)] leading-relaxed">
        <h2 className="text-lg font-bold">1. Information We Collect</h2>
        <p>
          Showphan collects minimal public profile information from GitHub when you sign in: your numeric GitHub ID, public username, public avatar image URL, and public display name. We do not access or store private repositories, financial details, or device identifiers.
        </p>

        <h2 className="text-lg font-bold">2. How Information Is Used</h2>
        <p>
          We use your data exclusively to display your public profile and manage your project showcases. We do not use third-party analytics trackers, sell data to advertisers, or send promotional emails.
        </p>

        <h2 className="text-lg font-bold">3. Cookies</h2>
        <p>
          Showphan uses strictly necessary session cookies managed by Better Auth to keep you signed in, alongside a local browser storage key to remember your theme preference (Dark/Light). We do not use tracking or advertising cookies.
        </p>

        <h2 className="text-lg font-bold">4. Account Deletion</h2>
        <p>
          You can permanently delete your account at any time from your Account Settings. Account deletion immediately cascades across our database and purges all stored cover images from Cloudflare R2 storage.
        </p>
      </div>
    </div>
  );
}
