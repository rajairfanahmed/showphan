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

