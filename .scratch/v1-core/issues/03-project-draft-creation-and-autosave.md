# 03: Project Draft Creation & Real-Time Form Auto-Save

**What to build:**
A responsive project creation and edit interface (`/dashboard/new` and `/dashboard/project/[id]/edit`). As the developer fills in the title, summary (140 chars max with counter), safe markdown description, links, tags (up to 5), role, and learnings, changes are autosaved to the database in the background with a `"Saved just now"` indicator. On desktop, a live side-by-side card preview and project page preview update synchronously.

**Blocked by:** 01, 02

**Status:** resolved

- [x] Add `Project` and `ProjectTechnology` models to `prisma/schema.prisma` with unique slug per user and relation mappings.
- [x] Implement server actions / API endpoints for creating and updating project drafts with optimistic concurrency check (`updated_at`).
- [x] Build `/dashboard/new` page with split-screen layout on desktop (Form on left, Live Card & Page Preview on right) and tabbed layout on mobile.
- [x] Integrate Markdown editor with Write and Preview tabs using `react-markdown` and `rehype-sanitize` (strip raw HTML and images).
- [x] Implement client-side debounce autosave hook with visual save status indicator.
- [x] Enforce project limit: Prevent creating a 31st project when user already has 30 projects.
