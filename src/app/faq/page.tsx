export default function FAQPage() {
  const faqs = [
    {
      q: "Is Showphan completely free?",
      a: "Yes. Showphan is 100% free and open source. There are no paid subscription tiers, hidden fees, or promotional ads.",
    },
    {
      q: "Can I add projects with closed-source or private repositories?",
      a: "Yes! If your code is private or proprietary, check 'Source code is private'. The project detail page will display a note stating the code is closed-source while still letting you show the live site, cover image, and tech stack.",
    },
    {
      q: "Why can't I publish my project yet?",
      a: "Showphan enforces a strict Quality Gate: every project must have a Title, a Summary (≤ 140 characters), a 16:9 Cover Image, at least one Technology tag, and at least one Live URL or Repository URL.",
    },
    {
      q: "What happens if I change my GitHub username later?",
      a: "Your Showphan profile slug is permanent and never changes even if you rename your GitHub account. This guarantees that links on existing resumes or social posts never produce 404 errors.",
    },
    {
      q: "Can I control search engine indexing?",
      a: "Yes. In Account Settings, you can switch off 'Show my profile in search engines' at any time to add noindex tags to all your pages.",
    },
    {
      q: "Is it Showphan or Show Phan or showfan?",
      a: "The official product name is Showphan. It is sometimes written colloquially as Show Phan or searched phonetically as showfan.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 flex-1">
      <div className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[var(--muted-foreground)]">
          Answers to the most common questions about Showphan.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <h2 className="text-base font-bold text-[var(--foreground)]">{faq.q}</h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
