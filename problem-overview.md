# Problem Overview: Showphan (Version 1)

## 1. Problem Statement
Software developers lack a dedicated, friction-free way to showcase their projects visually and effectively to non-technical or busy stakeholders (recruiters, clients, peers). 
- GitHub requires viewers to inspect code repositories and raw Markdown READMEs.
- LinkedIn flattens projects into bullet points without visual hierarchy or interactive links.
- Custom portfolio sites require significant overhead to design, deploy, and maintain, frequently remaining outdated or unfinished.

As a result, a developer's real "proof of work" remains hidden or poorly communicated.

## 2. Users and Stakeholders
- **Primary User (Developer):** Authenticates via GitHub. Needs to publish polished project showcases in under 5 minutes through an enforced-completion form and share a single unified profile link.
- **Consumer (Visitor):** Recruiters, hiring managers, clients, and fellow engineers accessing profiles on mobile or desktop without signing in. Requires instantaneous comprehension of what was built and with what tech stack.
- **Platform Owner:** Operates the platform on free tiers, dogfoods it for personal showcase, and manages data directly.
- **External Providers:** GitHub (Identity + Repo metadata), Neon (PostgreSQL), Cloudflare R2 (Object storage), Vercel (Edge runtime & hosting).

## 3. Current State
- Developers paste scattered links (GitHub repos, live URLs, Google Drive links) into resumes and message chats.
- Recruiters opening GitHub repos on mobile cannot easily preview the running application or ascertain the developer's exact role and stack.
- Self-built portfolios frequently break, have inconsistent mobile styling, or lack standardized metadata previews when shared on LinkedIn or WhatsApp.

## 4. Desired State
- Any developer signs in with GitHub and gets a canonical profile link (`showphan.com/<slug>`) that looks professional on first open on both mobile and desktop.
- Adding a project takes ~5 minutes with a guided checklist ensuring 100% completeness before publishing.
- High-fidelity rich previews (Open Graph/Twitter Cards) render automatically when profile and project links are shared on social platforms.
- The platform operates sustainably at zero cost on existing free tiers and is fully open-source.

## 5. Success Criteria
1. **Speed to Publish:** Adding a complete project takes ≤ 5 minutes.
2. **Strict Quality Gate:** 0% half-baked projects; 100% of published projects have a title, 140-char summary, 16:9 cover image, ≥1 technology, and ≥1 live/repo link.
3. **Mobile First:** Profile and project pages achieve 100% responsive compliance and reach main content in < 2.5s on mobile.
4. **Link Sharing Fidelity:** 100% of shared profile and project links produce rich Open Graph previews.
5. **Zero-Cost Sustainability:** The platform runs reliably on Vercel, Neon, and Cloudflare R2 free tier allocations for initial user base.

## 6. Scope

### In-Scope (Version 1)
- GitHub OAuth authentication (public profile only) via Better Auth.
- Developer profile (`/<slug>`) with avatar, bio, up to 6 featured projects, and responsive project grid.
- Standalone project page (`/<slug>/<project-slug>`) with 16:9 cover image, live/repo links, tech stack badges with icons, and safe markdown description.
- Dashboard for managing projects: Create, edit, reorder, feature toggle, publish/unpublish, and delete.
- Project creation form with live side-by-side preview, publish checklist, and auto-draft saving.
- Optional 1-click import of public repository metadata from GitHub.
- Cover image client-side resize (1600px WebP) and presigned direct upload to Cloudflare R2.
- Tech stack selector with centralized Iconify icons.
- Search engine indexability switch and automated SEO (sitemap, JSON-LD, metadata).
- Theme toggle: System, Light, and Dark (default).

### Out-of-Scope (Explicitly Excluded from V1)
- CV / Resume generator.
- Non-developer creator roles.
- Automated screenshot scraping.
- Social interactions (comments, likes, upvotes, feeds, bookmarks).
- Global platform search across all developers.
- Embedded iframes for live demos.
- Non-GitHub auth (GitLab, Bitbucket, Email/Password).
- Private repository access or README parsing.
- Monetization or paid tiers.
- Third-party visitor tracking/analytics.

## 7. Risks and Assumptions
- **Risk:** Neon idle database cold start (~1-2s delay after dormancy).
  - *Mitigation:* Cache public profiles on Edge/Next.js ISR; use pooled connection string.
- **Risk:** Unused orphan images in R2 consuming storage quota.
  - *Mitigation:* Daily Vercel Cron cleanup job to prune unreferenced R2 objects.
- **Risk:** GitHub API unauthenticated rate limits (60/hr) on star count.
  - *Mitigation:* Cache star count on server; use fine-grained GitHub token if threshold approached.
- **Assumption:** Users have public GitHub accounts and at least one project with a live URL or repository URL.

## 8. Open Questions & Unknowns
1. Confirmation of fine-grained session cookie expiration (recommended 30 days).
2. Selection of final starter list of Iconify icon keys for build-time offline bundle.
3. Rate limiting threshold per IP/User for draft creation and image presigning.
