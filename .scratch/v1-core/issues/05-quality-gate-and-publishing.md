# 05: Quality Gate Enforcement & Project Publishing

**What to build:**
Strict publishing validation panel. Displays a 5-item checklist indicating completion status (Title, Summary ≤140 chars, 16:9 Cover Image, ≥1 Technology, and ≥1 Live or Repo URL). The "Publish" button stays disabled until all 5 items are satisfied. Clicking "Publish" transitions the project to `PUBLISHED` status, updates public visibility, and opens a success modal with copyable public URL and share preview. "Unpublish" reverts to `DRAFT`.

**Blocked by:** 04

**Status:** resolved

- [x] Implement Quality Gate validator utility shared between client and server.
- [x] Build publish panel UI showing completion checklist with progress (e.g., "4 of 5 complete") and explicit missing items.
- [x] Implement Server Action `POST /api/projects/:id/publish` that re-validates the 5 rules on the server and sets status to `PUBLISHED`.
- [x] Implement Server Action `POST /api/projects/:id/unpublish` that resets status to `DRAFT`.
- [x] Build first-publish success modal displaying the public project link, quick copy button, and social card preview.
