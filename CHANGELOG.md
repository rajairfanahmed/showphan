# Changelog

All notable changes to the **Showphan** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-09

### Added
- **Authentication & Onboarding:**
  - Integrated Better Auth with GitHub OAuth provider (`read:user` public scope).
  - Configured trusted origins for local (`http://localhost:3000`) and production (`https://showphan.vercel.app`).
  - Automatic account provisioning with immutable, URL-safe developer username slugs.
- **Database Architecture:**
  - Neon PostgreSQL serverless database schema with Prisma ORM 7 and `@prisma/adapter-pg` connection pool.
  - Core entities: `User`, `Project`, `Technology`, `ProjectTechnology`, `Session`, `Account`, `Verification`.
  - Comprehensive seed script (`prisma/seed.ts`) populating 51 standard technologies across 6 software engineering categories.
- **Offline Iconography System:**
  - Bundler script (`scripts/bundle-icons.ts`) extracting 51 official SVG icon definitions into a lightweight local bundle (`src/generated/icons.json`, 169.8 KB).
  - `TechBadge` component rendering official color and monochrome icons with zero external CDN requests.
- **Project Creation & Editor:**
  - Project drafting engine (`/dashboard/new` and `/dashboard/project/[id]/edit`) with unique slug generation.
  - Real-time debounced autosave with visual timestamp indicators.
  - Desktop split-screen interface with live synchronization between input fields and card/detail previews.
  - Mobile responsive interface with dedicated "Edit" and "Preview" views.
  - Optional 1-Click GitHub Repository metadata import modal.
- **Storage & Image Optimization:**
  - Client-side canvas image processor enforcing 16:9 aspect ratios, WebP conversion, and hard file ceiling (< 1.0 MB).
  - Short-lived AWS S3 presigned PUT URLs directly to Cloudflare R2 object storage.
  - Automatic purging of old or deleted cover images from Cloudflare R2.
- **Publishing & Quality Gate:**
  - 5-rule Quality Gate validator enforcing Title, 140-char Summary, 16:9 Cover Image, ≥1 Technology, and ≥1 Link (Live Demo or Source Code).
  - Celebratory first-publish modal with shareable canonical URL and one-click clipboard copy.
  - Unpublish capability reverting projects to `DRAFT` status and returning HTTP 404 to public visitors.
- **Dashboard & Project Management:**
  - Unified project management interface (`/dashboard`) with thumbnail previews, status badges, and relative edit timestamps.
  - Filtering by status tabs ("All", "Published", "Drafts").
  - Drag-and-drop / keyboard-accessible project display reordering with persistent database positions.
  - Featured projects toggle with maximum ceiling constraint of 6 projects.
  - Irreversible project deletion modal with cascade database and storage cleanup.
- **Public Profile & Detail Showcase:**
  - Server-rendered public profile (`/<username>`) with developer avatar, bio (≤ 160 chars), featured grid, and project catalog.
  - Standalone project page (`/<username>/<project-slug>`) with 16:9 cover image lightbox modal, tech badges, safe markdown description, role details, and learnings.
  - UGC security: all external user links decorated with `rel="ugc nofollow noopener noreferrer"`.
  - Defense-in-depth markdown sanitization using `rehype-sanitize` stripping raw HTML, iframes, and embedded images.
- **Settings & Privacy Controls:**
  - Profile settings (`/settings`) for updating display name, bio, and refreshing GitHub avatars.
  - Search engine indexability toggle (`searchVisible`) controlling dynamic `sitemap.xml` inclusion and `noindex, nofollow` headers.
  - Account deletion workflow requiring exact username confirmation with cascade cleanup.
- **Design System & Theme Engine:**
  - Premium Zinc-950/Zinc-900 dark theme default with Amber-500 (`#F59E0B`) radiant accents.
  - Zero-flicker theme toggle supporting System, Light, and Dark modes via localStorage.
  - Static informative pages: `/about`, `/how-it-works`, `/faq`, `/privacy`, `/terms`, `/not-found`.
- **SEO & Social Sharing:**
  - Dynamic Open Graph and Twitter Card metadata generators for public profiles and individual project pages.
  - Dynamic XML sitemap generator (`src/app/sitemap.ts`) filtering unlisted profiles.
  - Dynamic `robots.txt` generator (`src/app/robots.ts`).
- **Automated Verification Suites:**
  - `tests/backend-suite.test.ts`: DB seed verification, quality gate logic, slug generation, storage validation.
  - `tests/e2e-integration.test.ts`: 17-point integration verification covering URL resolution and schema consistency.
  - `tests/requirements-verification.test.ts`: 16-point compliance test across all user stories (US-1 to US-12) and business rules (BR-1 to BR-9).
  - `tests/monitoring-observability.test.ts`: 16-point observability test covering structured JSON output, sensitive key redaction, and error serialization.
- **Monitoring & Observability:**
  - Dual health endpoints: `GET /health` (liveness, uptime, DB latency, R2 credentials) and `GET /ready` (readiness traffic probe).
  - Root rewrites in `next.config.ts` mapping `/health` and `/ready` to `/api/health` and `/api/ready`.
  - Next.js 16 Proxy convention (`src/proxy.ts`) propagating `x-request-id` headers across all incoming requests.
  - Structured logger (`src/lib/logger.ts`) emitting ISO timestamps, severity levels, duration, metadata, and automated `<REDACTED>` sanitization.
  - Global error boundaries (`src/app/error.tsx` and `src/app/global-error.tsx`) trapping unhandled exceptions with Next.js error digests.
  - Comprehensive monitoring specification (`docs/monitoring-plan.md`) defining performance baselines and alerting rules.
- **Maintenance & Architecture:**
  - Post-release retrospective (`docs/retrospective-v1.0.0.md`) analyzing navigation, automated checks, tool economy, and standards.
  - Codebase health report (`docs/codebase-health-report.md`) auditing module depth, seams, dead code, and dependency vulnerabilities.
  - Documented out-of-scope architecture decisions (`.out-of-scope/`): native video hosting and social feeds/comments.
  - Initialized technical debt backlog (`.scratch/tech-debt/issues/`) for continuous code evolution.

### Fixed
- Resolved client/server bundle boundary conflict by separating `@aws-sdk/client-s3` logic from client URL helpers (`src/lib/storage/urls.ts`).
- Resolved Next.js 16 dynamic prerender warnings by configuring explicit `export const dynamic = "force-dynamic"` across dynamic routes.
- Eliminated all ESLint TypeScript `any` warnings and unused import variables across route handlers and client components.
- Migrated deprecated `src/middleware.ts` to official Next.js 16 `src/proxy.ts` convention.
- Fixed TypeScript spread type analysis TS2698 in structured logger utility.
- Resolved CI runner engine mismatch by upgrading GitHub Actions environment to Node 22 LTS.
