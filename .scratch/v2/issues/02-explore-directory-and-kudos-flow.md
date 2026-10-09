# 02: Explore Showcase Hub & Kudos Action Flow

**What to build:** Build the public community discovery catalog (`/explore` and `/explore/[tech]`) featuring trending feeds (Today, Week, All Time), instant technology filtering, keyword search, and the interactive 1-click GitHub-authenticated Kudos action flow with live particle/counter updates.

**Blocked by:** 01: Schema & Trending Algorithm Core.

**Status:** closed-completed

- [x] Implement `GET /api/explore` with query parameters `?tab=trending|newest|kudos&tech=[slug]&q=[search]`.
- [x] Implement `POST /api/projects/[id]/kudos` and `DELETE /api/projects/[id]/kudos` verifying authentication, duplicate vote prevention, counter increment/decrement, and trending score recalculation.
- [x] Build the `/explore` page layout with Hero banner, tab switcher, technology filter pills, and project card grid.
- [x] Build `/explore/[tech]` dynamic route with server-side rendered SEO title and description for Google Sitelinks indexing.
- [x] Implement client-side `KudosButton` with optimistic UI update, amber particle burst micro-interaction, and toast notification.
- [x] Add integration tests in `tests/explore-kudos.test.ts` asserting unauthenticated returns 401, authorized vote increments score, and duplicate vote is prevented.

