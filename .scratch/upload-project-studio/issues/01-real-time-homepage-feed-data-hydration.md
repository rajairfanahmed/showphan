# 01: Real-Time Homepage Feed Data Hydration

**What to build:** The homepage (`/`) and client feed dynamically fetch real published projects from the database via `/api/explore` on mount, seamlessly prepending real community submissions ahead of local fallbacks with zero layout shift.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Homepage server component passes real database projects when available
- [x] Client `HomepageFeedContent` queries `/api/explore` on mount and revalidates dynamically
- [x] Prepend real projects to feed without visual flash or layout shift
- [x] Fallbacks retain graceful degradation if database is offline or empty
