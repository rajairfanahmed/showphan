# 07: Public Profile & Standalone Project Pages

**What to build:**
Public-facing showcase views. The profile page (`/[slug]`) displays avatar, name, bio, copyable profile link, featured projects carousel/cards (up to 6), and a 3-column responsive project grid. The standalone project page (`/[slug]/[project]`) displays full 16:9 cover image with click-to-expand lightbox viewer, title, summary, action buttons (Live Demo, Source Code, Copy Link), tech badges with icons, safe markdown description, role, and learnings. Draft projects return a 404 response to unauthenticated visitors.

**Blocked by:** 06

**Status:** resolved

- [x] Implement public profile route `/[slug]` with Edge ISR caching (`revalidate = 60`), filtering only `PUBLISHED` projects.
- [x] Build profile header section (Avatar, Name, Bio, "Copy profile link" with toast, owner action bar if signed in).
- [x] Render featured projects section (larger cards) and standard project grid (1 col mobile, 2 col tablet, 3 col desktop).
- [x] Implement standalone project page route `/[slug]/[project]` with cover image lightbox viewer (Escape to close).
- [x] Enforce external link safety (`rel="ugc nofollow noopener noreferrer"`) and private code badge (`"Source code is private"`).
- [x] Ensure draft projects return 404 to visitors, and display with a "Draft" banner to the signed-in owner.
