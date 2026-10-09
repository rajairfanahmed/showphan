# 06: Project Management Dashboard

**What to build:**
Unified `/dashboard` page for authenticated developers. Displays project rows with thumbnail, title, status badges (`Draft` / `Published`), featured toggle switch (max 6), last edited relative timestamp, and an action menu (Edit, View, Publish/Unpublish, Delete). Supports drag-and-drop handles and keyboard controls for manual reordering, filter tabs (All, Published, Drafts), and a project counter (out of 30). Deleting a project confirms deletion and purges its cover image from R2.

**Blocked by:** 05

**Status:** resolved

- [x] Build `/dashboard` overview page showing user projects with count indicator (e.g., "12 / 30 projects").
- [x] Implement filter tabs: "All", "Published", and "Drafts".
- [x] Add drag-and-drop and accessible keyboard "Move up" / "Move down" reordering that updates project `position`.
- [x] Implement featured toggle with strict enforcement of maximum 6 featured projects.
- [x] Implement project deletion modal with cascade deletion in database and R2 cover image cleanup.
- [x] Add empty state with "Add your first project" and "Import from GitHub" calls to action.
