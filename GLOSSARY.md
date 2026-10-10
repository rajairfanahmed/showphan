# Showphan Domain Glossary

This document establishes the official domain language for Showphan. Use these exact terms across codebase, documentation, tests, and discussions.

---

### Core Terms

**Developer**:
A registered user who signs in via GitHub, creates a profile, and manages their own projects.
_Avoid_: User, Member, Account holder, Author.

**Visitor**:
An unauthenticated person (recruiter, peer, client) viewing a public profile or project page.
_Avoid_: Guest, Public user, Anonymous user.

**Owner**:
The platform creator/administrator who runs Showphan.
_Avoid_: Admin, Superuser.

**Profile**:
The public single-link portfolio page of a Developer (hosted at `/<slug>`), showing their avatar, bio, featured projects, and project grid.
_Avoid_: Account page, User page, Portfolio site.

**Project**:
A curated showcase entry created by a Developer containing exactly one 16:9 cover image, summary, tech stack, markdown description, and live/source URLs.
_Avoid_: Post, Repo, Work item, Portfolio item.

**Cover Image**:
The single, verified 16:9 visual banner representing a project (max 1600px wide, stored in Cloudflare R2 as WebP).
_Avoid_: Screenshot, Thumbnail, Banner, Photo.

**Draft**:
A project that is saved and editable by the Developer but hidden and returns 404 to visitors.
_Avoid_: Unpublished, Inactive, Hidden.

**Published**:
A project that meets all 5 business validation rules and is publicly visible on the developer's profile and its standalone project page.
_Avoid_: Live, Active, Public.

**Technology**:
A standardized, centrally managed tool or language tag accompanied by an official Iconify icon (brand color or mono).
_Avoid_: Skill, Tool, Language, Badge.

**Tag**:
A free-text label attached to a project (up to 5 per project).
_Avoid_: Category, Keyword, Topic.

**Featured Project**:
A developer-highlighted project displayed prominently at the top of their profile (maximum 6 per developer).
_Avoid_: Pinned project, Top project, Starred project.

**Profile Slug**:
The immutable URL path identifier created from the developer's initial GitHub username (`/<slug>`).
_Avoid_: Username, Handle, Route.

**Quality Gate**:
The strict 5-condition checklist enforced on the server and client before any project can transition from Draft to Published.
_Avoid_: Validation rules, Publish check.

**Reserved System Slugs**:
Protected URL paths (e.g., `admin`, `api`, `login`, `dashboard`, `settings`, `about`, `terms`, `privacy`) blocked from being claimed as developer slugs.
_Avoid_: Blacklist, Blocked usernames.

**Liveness Probe**:
The health check endpoint (`/health` or `/api/health`) that verifies if the application process is running and reports uptime and database latency.
_Avoid_: Ping URL, Heartbeat script.

**Readiness Probe**:
The traffic readiness endpoint (`/ready` or `/api/ready`) that checks if the system can immediately service user traffic by validating live database connectivity.
_Avoid_: Warmup check, Smoke endpoint.

**Structured Logging**:
Emitting machine-readable JSON log objects with consistent keys (`timestamp`, `level`, `message`, `requestId`, `userId`, `durationMs`) rather than unstructured strings.
_Avoid_: Console dump, Plaintext log.

**PII Redaction**:
The automated sanitization process that replaces sensitive information (passwords, tokens, cookies, auth secrets, API keys) with `<REDACTED>` before emission to stdout or log aggregators.
_Avoid_: Secret masking, Scrubber.

**Proxy Convention**:
The Next.js 16 file convention (`src/proxy.ts`) replacing deprecated `middleware.ts` for incoming request interception, header propagation, and tracing.
_Avoid_: Next Middleware, Edge handler.

**Showcase Directory**:
The public discovery portal (`/explore`) allowing Visitors and search engines to filter by Technology, search keywords, and explore published Developer profiles.
_Avoid_: Feed, Marketplace, Project list, Search catalog.

**Badge Card**:
An embeddable dynamic SVG/WebP banner rendered via `/api/badge/[slug]` for Developers to embed in GitHub READMEs, generating proof-of-work visibility and repo stars.
_Avoid_: Shield, Widget, Embed button.

**Media Lightbox**:
The high-resolution modal zoom overlay invoked by clicking a project's 16:9 Cover Image on the showcase page, allowing visitors to inspect fine UI details, typography, and screenshots without distraction.
_Avoid_: Popup, Photo zoom, Image modal.

**Live Site Link**:
The primary outbound external link on a project showcase connecting visitors directly to the developer's live production application, opening in a secure new tab with proper rel security attributes.
_Avoid_: External demo, Preview iframe, Sandbox container.

**Creator Attribution**:
The permanent branding and metadata linking the platform and open-source codebase to Raja Irfan Ahmed (https://rajairfanahmed.vercel.app).
_Avoid_: Author tag, Credits blurb.

**Command Studio**:
The real-time project creation and editing workspace featuring 1-click GitHub metadata synchronization, live dual-column preview, and the interactive 5-Rule Quality Gate HUD.
_Avoid_: Form editor, Project creator, Settings form.

**Viewport Switcher**:
The responsive multi-device preview control (Desktop, Tablet, Mobile) embedded in the Live Sandbox viewer.
_Avoid_: Screen resizer, Device toggler.

**Kudos**:
The single, GitHub-authenticated upvote awarded to a Project by a Developer, feeding the time-decay trending algorithm.
_Avoid_: Upvote, Like, Star, Point.

**Project of the Day**:
The 24-hour spotlight banner awarded automatically at midnight UTC to the Project with the highest Kudos velocity.
_Avoid_: Daily winner, Featured project, Top post.

**Peer Reactions**:
Standardized emoji badges (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) clickable by Visitors on project pages.
_Avoid_: Emojis, Stickers, Comment badges.

**Inspiration Vault**:
A Developer's private collection of bookmarked projects saved while browsing the Showcase Directory, located at `/dashboard/bookmarks`.
_Avoid_: Bookmarks, Favorites list, Saved items.

**Showcase Simulator**:
The interactive hero component on the homepage allowing prospective developers and visitors to test showcase features (16:9 lightbox, viewport switching, and tech tags) live without an account.
_Avoid_: Hero mockup, Fake demo, Static screenshot.

**Dynamic OG Card**:
A high-resolution 1200×630 social preview image dynamically generated via Next.js ImageResponse for developer profiles and projects when shared on Twitter/X, LinkedIn, or Discord.
_Avoid_: Social banner, Twitter preview, Fallback image.

**Sandbox Isolation**:
The restrictive HTML5 iframe sandboxing policy (`allow-scripts allow-same-origin allow-forms`) enforced on live project demo previews to prevent clickjacking and unprompted top-level navigation.
_Avoid_: Frame wrapper, Embed lock, Security border.

**Star Widget**:
The interactive header and hero navigation control displaying real-time GitHub repository star counts, direct repo links, and creator portfolio attribution to Raja Irfan Ahmed.
_Avoid_: Star button, GitHub badge, Like widget.

**Mobile Navigation Dock**:
The bottom floating frosted-glass navigation pill on mobile viewports (< 1024px) providing primary 1-tap thumb access to Feed, Search, Explore, Bookmarks, and Submit Project.
_Avoid_: Bottom bar, Mobile tab bar, Phone navigation.

**Launch Bar**:
The horizontal metadata row situated directly between the Cover Image and Title containing the Status Badge, Developer Attribution, Relative Publication Date, and external Live Application link.
_Avoid_: Header bar, Subtitle row, Card metadata strip.

**Dynamic Fluid Grid**:
The responsive CSS Grid container configured with a 360px minimum card threshold (`repeat(auto-fill, minmax(360px, 1fr))`), ensuring cards never suffer from horizontal truncation or button clipping while expanding smoothly across wide viewports.
_Avoid_: Masonry layout, Fixed 3-column grid, Static breakpoints.

**Ceramic Daylight System**:
The Awwwards-caliber Day/Light design system based on silk mineral canvas (`#f5f6fa`), ceramic floating white surfaces (`#ffffff`), deep obsidian ink typography (`#0a0d14`), and Electric Klein Cobalt (`#0052ff`) accents, completely devoid of orange or amber tones.
_Avoid_: Light mode, Plain white theme, Default skin.

**Portfolio Shelf**:
The curated top section of a developer's public profile page (`/<slug>`) highlighting up to 4–6 flagship published projects in prominent 16:9 cards before the full project archive.
_Avoid_: Pinned list, Featured row, Top grid.

**Proof-of-Work Badges**:
The aggregated, verified platform metrics displayed on a developer's profile banner denoting total community Kudos earned and published project count.
_Avoid_: Vanity metrics, Profile stats, Karma badges.







