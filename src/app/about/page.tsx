export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 flex-1">
      <div className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          About Showphan
        </h1>
        <p className="text-base text-[var(--muted-foreground)]">
          The story behind the name and our mission to highlight developer proof-of-work.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
        <p>
          Showphan joins <strong>&quot;show&quot;</strong>, the practical act of displaying work, with <strong>&quot;phan&quot;</strong>, a root taken from the Greek verb <em>phainein</em>, which means to bring to light or make manifest (as in <em>phenomenon</em>). Together, the name describes bringing hidden coding achievements into view.
        </p>

        <p>
          Sometimes written as <em>Show Phan</em> or searched phonetically as <em>showfan</em>, the platform was created by{" "}
          <a
            href="https://rajairfanahmed.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-500 hover:text-amber-400 underline underline-offset-4"
          >
            Raja Irfan Ahmed
          </a>{" "}
          with a singular focus: giving software developers one unified, professional link that highlights what they&apos;ve built without demanding weeks spent configuring personal websites.
        </p>

        <h2 className="text-xl font-bold text-[var(--foreground)] pt-4">What Problem Does It Solve?</h2>
        <p>
          GitHub is indispensable for code review and version control, but visitors and non-technical recruiters evaluating a project must navigate raw repositories, markdown files, and commit logs. LinkedIn flattens projects into brief text bullet points. Personal portfolio templates frequently stall halfway through construction.
        </p>
        <p>
          Showphan bridges this gap with an enforced Quality Gate: every project published includes a verified 16:9 screenshot, verified technology tags with brand icons, a summary, a live link or code repository, and what the developer learned.
        </p>

        <h2 className="text-xl font-bold text-[var(--foreground)] pt-4">Free and Open Source</h2>
        <p>
          Showphan is completely open source under the MIT License. It runs sustainably on generous cloud free tiers (Vercel, Neon PostgreSQL, and Cloudflare R2), requiring zero subscription fees or premium paywalls from developers.
        </p>
      </div>
    </div>
  );
}
