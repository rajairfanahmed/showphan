# Feature Specification: Showphan Version 2 (Product of the Year Platform)

## Problem Statement

While Showphan V1 successfully gave developers a 5-minute single-link portfolio with a 5-rule Quality Gate, it operates as an isolated static utility. Developers publish their link once and leave, leaving visitors with only flat screenshots and no way to discover what other developers are creating. 

Furthermore:
- Prospective visitors and recruiters have no central directory to discover and evaluate projects.
- There is no viral flywheel encouraging developers to market their showcases on GitHub or social platforms.
- Visitors cannot test live applications directly within Showphan, requiring external tab switching.
- Social sharing on Twitter, LinkedIn, and Discord defaults to a generic fallback image rather than dynamic proof-of-work cards.
- Developers using modern or niche tools outside the initial 51 technologies are unable to tag their exact stack.

## Solution

Showphan V2 transforms the platform from a static portfolio tool into an active, community-driven **Developer Proof-of-Work Platform**:
1. **Showcase Directory (`/explore`)**: A public discovery hub featuring trending projects, real-time search, technology filtering, and Google Sitelinks crawl paths.
2. **GitHub-Verified Kudos & Time-Decay Trending**: Authenticated developers can award 1 Kudos per project, powering an objective logarithmic decay algorithm that elevates newly launched, high-momentum projects.
3. **Automated Project of the Day 🥇**: A daily 24-hour spotlight banner celebrating the top-voted project and prompting viral social announcements on X, LinkedIn, and Reddit.
4. **Dynamic README Badge Cards (`/api/badge/[slug]`)**: An embeddable SVG banner developers can place in their personal GitHub profile READMEs, driving continuous backlinks and repository stars.
5. **Interactive Live Sandbox**: An in-browser preview tab on project pages with a responsive Viewport Switcher (Desktop / Tablet / Mobile) and strict HTML5 sandbox isolation.
6. **Command Studio with 1-Click GitHub Sync**: Fast project creation that syncs title, description, language, and repository links from GitHub with live dual-column preview and real-time Quality Gate HUD status.
7. **Dynamic OpenGraph Engine (`/api/og`)**: Automatic 1200×630 dark-mode social cards generated via Next.js `ImageResponse` displaying developer avatars, project titles, and tech badges.
8. **Permanent Creator Attribution**: Prominent recognition and backlink authority directed to Raja Irfan Ahmed ([https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)) across footer, metadata, schema, and navigation widgets.

---

## User Stories

### Discovery & Community Experience
1. As a visitor, I want to browse the `/explore` directory so that I can discover outstanding projects built by developers worldwide.
2. As a visitor, I want to filter the showcase directory by specific technologies (e.g., React, Next.js, Rust, Python) so that I can evaluate developers with relevant technical skills.
3. As a visitor, I want to search showcases in real time by keywords in titles, summaries, and developer names so that I can locate specific domains or applications instantly.
4. As a visitor, I want to view "Trending Today", "Trending This Week", and "Newest" feeds so that I am always exposed to fresh, active engineering work.
5. As a visitor, I want to see the daily "Project of the Day" winner prominently featured on the homepage so that I can celebrate the community's top achievements.
6. As a search engine crawler, I want clear semantic links and structured JSON-LD schemas across `/explore` and `/[slug]` so that Showphan ranks with full Google Sitelinks like Dev.to.

### Developer Engagement & Social Proof
7. As an authenticated developer, I want to award 1 Kudos (⭐) to any published project so that I can endorse fellow developers' work.
8. As an authenticated developer, I want my Kudos to immediately update the project counter with an amber particle micro-interaction so that I receive satisfying tactile feedback.
9. As an authenticated developer, I want to be prevented from giving multiple Kudos to the same project so that the trending rankings remain fair and tamper-proof.
10. As a visitor, I want to click lightweight Peer Reactions (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) so that I can express appreciation without writing long comments.
11. As a visitor, I want a direct "Discuss on GitHub" button on every project page so that I can open discussions or issues directly on the author's source repository.
12. As an authenticated developer, I want to save inspiring showcases to my private Inspiration Vault (`/dashboard/bookmarks`) so that I can reference them later.
13. As an authenticated developer, I want to view and manage my bookmarked showcases from my dashboard with 1-click unsave options.

### Live Sandbox & Visual Proof
14. As a visitor on a project page, I want to toggle between the 16:9 Cover Image and an Interactive Live Sandbox so that I can test the web application without leaving Showphan.
15. As a visitor testing a project in the Live Sandbox, I want to switch between Desktop, Tablet, and Mobile viewports so that I can verify the app's responsiveness across screen sizes.
16. As the platform, I want to enforce strict iframe sandbox attributes (`sandbox="allow-scripts allow-same-origin allow-forms"`) on the Live Sandbox so that visitors are protected against clickjacking or top-level navigation.
17. As a visitor, I want a fallback "Open in New Tab ↗" button on the Live Sandbox so that I can access the full site if an external host disallows framing.

### The GitHub Star Growth Flywheel
18. As a developer, I want to copy a markdown snippet containing an embeddable dynamic SVG Badge Card from my settings or dashboard so that I can showcase my verified proof-of-work on my personal GitHub README.
19. As a visitor viewing a developer's GitHub README, I want the embedded Badge Card to display their latest published projects, tech stacks, and a subtle "Powered by Showphan • ⭐ Star on GitHub" callout so that I can discover the platform.
20. As a visitor on Showphan, I want an interactive Star Widget in the navigation bar displaying live repository stars so that I am prompted to support the open-source repository.

### Command Studio & Custom Technologies
21. As a developer drafting a project, I want to paste a public GitHub repository link or select from my repositories to auto-populate the title, description, primary language, and repository URL in under 5 seconds.
22. As a developer drafting a project, I want to add custom technologies outside the 51 starter list so that I can accurately tag modern, niche, or proprietary libraries.
23. As a developer, I want custom technology tags to render with clean styled badges so that they match the visual quality of official Iconify badges.
24. As a developer in the Command Studio, I want to watch the 5-Rule Quality Gate HUD checkmarks light up dynamically as I meet each requirement so that I know exactly when my project is ready to publish.
25. As a developer, I want debounced autosaving with an unobtrusive timestamp indicator so that my progress is preserved without aggressive server spam.

### Social Sharing & Performance
26. As a developer sharing my profile or project link on X, LinkedIn, or Discord, I want a dynamic 1200×630 OpenGraph card to display my avatar, project title, and tech icons so that my post commands high attention and clicks.
27. As a mobile visitor, I want the entire platform to load in sub-second times with zero heavy JavaScript animation overhead so that navigation feels native and battery-efficient.
28. As a visitor, I want to experience subtle GPU-accelerated ambient glows, card lift transitions, and smooth modals implemented purely with CSS tokens.
29. As the platform architect, I want permanent creator attribution linking to Raja Irfan Ahmed ([https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)) across footer, metadata, and about pages so that creator authority is preserved across all deployments.

---

## Implementation Decisions

### 1. Database Schema Extensions (Prisma ORM)
- Introduce `Kudos` model with composite unique constraint `@@unique([userId, projectId])` and foreign keys to `User` and `Project` with cascade deletion.
- Introduce `Bookmark` model with composite unique constraint `@@unique([userId, projectId])` and foreign keys to `User` and `Project` with cascade deletion.
- Extend `Project` model with:
  - `kudosCount Int @default(0)`
  - `viewsCount Int @default(0)`
  - `trendingScore Float @default(0)`
  - `sandboxUrl String?`
  - `sandboxEnabled Boolean @default(false)`
- Extend `Technology` model with an `isCustom Boolean @default(false)` flag to allow on-the-fly technology additions.

### 2. Time-Decay Trending Algorithm
- Implement logarithmic time-decay scoring:
  $$\text{Score} = \frac{\text{Kudos} + 1}{(\text{Age in Hours} + 2)^{1.5}}$$
- Recalculate `trendingScore` on every Kudos mutation or via an hourly background maintenance job.
- Query `/api/explore` using ordered indices on `trendingScore DESC` for trending feeds, and `createdAt DESC` for newest feeds.

### 3. Public Route Hierarchy & Navigation
- `/explore`: Server Component streaming trending project cards, category filters, and search inputs.
- `/explore/[tech]`: Server Component rendering projects filtered by technology slug with dynamic SEO metadata targeting Google search queries.
- `/[slug]`: Public Developer profile upgraded with client-side technology filter chips and copy-link share bar.
- `/[slug]/[project]`: Project showcase featuring the Live Sandbox viewer, multi-device Viewport Switcher, and Kudos / Peer Reaction bar.
- `/dashboard/bookmarks`: Developer Inspiration Vault displaying saved project cards.
- `/dashboard/studio`: Command Studio unifying creation, GitHub autofill, and live dual-pane preview.

### 4. Dynamic SVG Badge Card Engine (`/api/badge/[slug]`)
- HTTP GET route handler returning `image/svg+xml` with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
- Renders an ultra-sharp 480×160 dark-mode SVG card featuring the developer's avatar, published project count, top 3 tech badges, verified proof-of-work link, and a subtle "Star on GitHub" CTA banner.

### 5. Dynamic OpenGraph Generation (`/api/og`)
- Edge route handler utilizing Next.js `ImageResponse` to generate 1200×630 PNG images on-the-fly.
- Dynamically embedded in metadata `openGraph.images` for `/[slug]` and `/[slug]/[project]`.

### 6. Zero-JS Weight Motion System
- Pure CSS hardware-accelerated transitions via Tailwind utility tokens (`translate3d(0,0,0)`, `will-change: transform`, `cubic-bezier(0.16, 1, 0.3, 1)`).
- Ambient radial border spotlight powered by CSS variables (`--mouse-x`, `--mouse-y`) without heavy JavaScript physics libraries.

### 7. Sandbox Isolation & Clickjacking Defense
- Live Sandbox previews rendered inside `<iframe sandbox="allow-scripts allow-same-origin allow-forms" loading="lazy" referrerpolicy="no-referrer">`.
- Content Security Policy and frame-ancestors headers validated in `src/proxy.ts`.

---

## Testing Decisions

### Observable External Behavior Testing
Tests will exclusively assert external HTTP contracts, database state transitions, and user-visible outcomes, avoiding assertions on internal component state.

### Testing Seams
1. **The API & Contract Seam (Highest Seam)**:
   - `/api/projects/[id]/kudos`: Assert unauthenticated returns 401; assert first request increments `kudosCount` to 1; assert duplicate request returns 409 or toggles vote; assert database composite unique constraint is enforced.
   - `/api/projects/[id]/bookmark`: Assert bookmark creation, duplicate prevention, and deletion contracts.
   - `/api/badge/[slug]`: Assert returns HTTP 200 with `Content-Type: image/svg+xml`, containing sanitized developer slug and valid SVG markup.
2. **The Pure Logic Seam**:
   - `calculateTrendingScore`: Unit tests validating that recent projects with moderate kudos outrank older projects with higher raw kudos counts.
   - `evaluateQualityGate`: Verify existing 5-rule publishing validation remains unbroken.
3. **The Security Seam**:
   - Assert outbound links carry `rel="ugc nofollow noopener noreferrer"`.
   - Assert sandbox iframe markup contains restrictive `sandbox` attributes.

---

## Out of Scope (Version 2)

- PDF resume export (explicitly rejected to keep focus on high-fidelity web showcases).
- Full threaded comment sections (rejected to avoid spam and toxic moderation burdens; replaced with lightweight Peer Reactions).
- Paid tiers, subscriptions, or Stripe billing (platform remains 100% free and open-source).
- Non-GitHub authentication providers (Better Auth remains focused on GitHub OAuth to guarantee verified developer identity).
- Automated web crawler screenshot scraping (developers provide verified 16:9 cover images directly).

---

## Further Notes

- All changes maintain strict compatibility with Next.js 16 App Router, React 19, Better Auth, and Neon PostgreSQL.
- Permanent attribution to Raja Irfan Ahmed ([https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)) is embedded into the core design system and root metadata.
