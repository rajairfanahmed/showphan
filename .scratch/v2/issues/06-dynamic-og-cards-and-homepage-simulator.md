# 06: Dynamic OG Engine, Showcase Simulator, and Star Widget

**What to build:** Build the dynamic OpenGraph card generation engine via Next.js `ImageResponse` (`/api/og/profile` and `/api/og/project`), upgrade the homepage hero with an interactive Showcase Simulator component, and install the live GitHub Star Widget with creator portfolio attribution in the navigation bar.

**Blocked by:** 03: Dynamic README Badge Card Engine, 05: Live Sandbox with Viewport Switcher.

**Status:** closed-completed

- [x] Implement `GET /api/og/profile` and `GET /api/og/project` utilizing Next.js `ImageResponse` to generate 1200×630 dark-mode social cards with developer avatar, project title, and tech badges.
- [x] Connect `generateMetadata` in `/[slug]` and `/[slug]/[project]` to point `openGraph.images` to the dynamic OG routes, replacing the static `vercel.svg` fallback.
- [x] Build the interactive `ShowcaseSimulator` component in `src/app/page.tsx` allowing visitors to test the 16:9 lightbox and device switcher without logging in.
- [x] Add the live GitHub Star Widget in `Header.tsx` and homepage hero fetching repo star count, with direct links to `github.com/rajairfanahmed/showphan` and Raja Irfan Ahmed's portfolio (`https://rajairfanahmed.vercel.app`).
- [x] Run full test suite, linting, and build verification: `npm run typecheck`, `npm run lint`, and `npm test`.
