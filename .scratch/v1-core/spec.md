# Feature Specification: Showphan Version 1 (Core Platform)

## 1. Problem Statement
Developers need a clean, friction-free way to showcase their projects visually and effectively to recruiters, clients, and peers with a single link. GitHub repositories require technical inspection, LinkedIn flattens projects into text, and personal portfolio websites take substantial effort and often remain unfinished.

## 2. Solution
Showphan: A fast, free, open-source web platform where developers authenticate with GitHub and publish complete, high-impact project showcases in under 5 minutes. The platform enforces a strict Quality Gate before publishing, provides live side-by-side editing previews, bundles offline technology icons, direct-uploads 16:9 WebP cover images to Cloudflare R2, and serves fast, SEO-optimized public profiles (`/[slug]`) and standalone project pages (`/[slug]/[project]`).

## 3. User Stories
- **US-1 (Auth & Onboarding):** As a developer, I want to sign in with GitHub so that I can manage my portfolio securely without creating another password.
- **US-2 (Drafting & Autosave):** As a developer, I want to create projects with live side-by-side preview and background autosaving so that I never lose my work.
- **US-3 (Cover Image Upload):** As a developer, I want to crop and upload a 16:9 cover image directly to Cloudflare R2 so that my work is visually compelling.
- **US-4 (Quality Gate & Publishing):** As the platform, I want to enforce completeness (title, summary, cover image, tech stack, live/repo link) so that no half-baked projects are published.
- **US-5 (Public Profile):** As a visitor, I want to view a developer's profile via `/[slug]` so that I can see their featured projects and skills in seconds.
- **US-6 (Project Detail):** As a visitor, I want to open a dedicated project page with a full cover image lightbox, tech stack badges, safe markdown, and live links.
- **US-7 (Dashboard):** As a developer, I want to manage, reorder, toggle featured, and delete my projects from `/dashboard`.
- **US-8 (GitHub Import):** As a developer, I want to import public repository details to prefill project fields instantly.
- **US-9 (Settings & Privacy):** As a developer, I want to edit my bio, toggle search engine visibility, or delete my account.
- **US-10 (Theme & SEO):** As a user, I want a dark-by-default interface with rich social preview cards when sharing links on WhatsApp or LinkedIn.

## 4. Implementation Decisions
- **Framework:** Next.js 16 (App Router) on Vercel with Server Components and ISR Edge Caching.
- **Database & ORM:** Neon Serverless PostgreSQL with Prisma ORM 7 using `@prisma/adapter-pg` connection pool.
- **Authentication:** Better Auth with GitHub OAuth provider, public profile scope (`read:user`), and 30-day session cookies.
- **Image Storage:** Browser-side canvas resize (1600px WebP, <1MB) with direct PUT uploads to Cloudflare R2 via AWS S3 presigned URLs.
- **Technology Icons:** Offline build-time extraction of Iconify SVGs (simple-icons, devicon, logos) via `@iconify/utils`.
- **Markdown Safety:** Safe Markdown parsing using `react-markdown`, `remark-gfm`, and `rehype-sanitize` with raw HTML and image tags stripped.
- **Concurrency & Limits:** Optimistic locking via `updated_at`, max 30 projects, max 6 featured projects, max 15 technologies, max 5 tags.

## 5. Testing Decisions
- **Observable Behavior:** Tests verify user-visible outcomes and API response contracts, not internal implementation trivia.
- **Seams for Testing:**
  - Auth seam: Session validator and route protection proxy.
  - Quality Gate seam: Pure validator function testing 5 completion criteria.
  - Storage seam: S3 presigned URL generation and MIME/size contract.
  - Data seam: Prisma database mutations and cascade deletion.
- **E2E/Integration:** Form autosave, publish transition, public profile rendering, 404 on visitor access to drafts.

## 6. Out of Scope (Version 1)
- CV/Resume generator.
- Non-developer creators.
- Automated web screenshot scraping.
- Social feeds, comments, reactions, upvotes, or bookmarks.
- Multi-user platform-wide search.
- Embedded live iframe demos.
- Non-GitHub login providers.
- Private repository access or README parsing.
- Paid tiers or visitor tracking analytics.
