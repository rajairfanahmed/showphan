# 03: Dynamic README Badge Card Engine

**What to build:** Build the `/api/badge/[slug]` route that dynamically renders a high-definition 480×160 dark-mode SVG card summarizing a developer's verified proof-of-work, and add a 1-click Markdown copy snippet in settings and dashboard so developers can embed it in their GitHub profile READMEs.

**Blocked by:** 01: Schema & Trending Algorithm Core.

**Status:** closed-completed

- [x] Implement `GET /api/badge/[slug]` returning `image/svg+xml` with edge caching (`s-maxage=3600, stale-while-revalidate=86400`).
- [x] Render developer avatar, display name, verified GitHub username, published project count, total kudos count, and top 3 tech badges.
- [x] Embed a high-contrast footer inside the SVG: `"Showphan Proof-of-Work • ⭐ Star on GitHub"`.
- [x] Add an embed snippet card on `/dashboard` and `/settings` with 1-click "Copy Markdown" button:
  `[![Showphan Showcase](https://showphan.vercel.app/api/badge/[slug])](https://showphan.vercel.app/[slug])`.
- [x] Add integration test in `tests/badge-endpoint.test.ts` asserting valid SVG markup, HTTP 200, correct Content-Type, and 404 on nonexistent slugs.

