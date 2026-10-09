# 01: Schema & Trending Algorithm Core

**What to build:** Expand the Prisma schema to support community engagement (`Kudos` and `Bookmark` models with unique composite constraints), add project interaction counters (`kudosCount`, `viewsCount`, `trendingScore`, `sandboxUrl`, `sandboxEnabled`), and implement the pure unit-tested logarithmic time-decay scoring algorithm:
$$\text{Score} = \frac{\text{Kudos} + 1}{(\text{Age in Hours} + 2)^{1.5}}$$

**Blocked by:** None (can start immediately).

**Status:** closed-completed

- [x] Add `Kudos` model in `prisma/schema.prisma` with `@@unique([userId, projectId])` and relations to User and Project.
- [x] Add `Bookmark` model in `prisma/schema.prisma` with `@@unique([userId, projectId])` and relations to User and Project.
- [x] Add `kudosCount`, `viewsCount`, `trendingScore`, `sandboxUrl`, `sandboxEnabled` fields to `Project` model in Prisma.
- [x] Implement pure `calculateTrendingScore(kudosCount: number, createdAt: Date): number` function in `src/lib/projects/trending.ts`.
- [x] Add comprehensive unit tests in `tests/trending.test.ts` verifying that fresh projects with high velocity outrank stale projects with higher all-time counts.
- [x] Run `npx prisma generate` and verify `npm run typecheck` passes with zero errors.
