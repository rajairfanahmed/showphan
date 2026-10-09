# 04: Command Studio & Custom Technology Badges

**What to build:** Upgrade the project editor into the Command Studio with 1-Click GitHub Repository Sync, dynamic custom technology creation with styled fallback badges, and real-time Quality HUD checkmark lighting animations.

**Blocked by:** 02: Explore Showcase Hub & Kudos Action Flow.

**Status:** ready-for-agent

- [ ] Add 1-Click GitHub Repository Sync button in the studio that queries `/api/github/repos` and auto-populates title, summary, language, and repository links.
- [ ] Support custom technology entry in `TechBadge` component and database schema: if a tool is outside the 51 seeds, render a styled badge with custom text and distinct color pill.
- [ ] Add real-time 5-Rule Quality HUD indicators with smooth CSS checkmark completion transitions.
- [ ] Implement Bookmark toggle (`/api/projects/[id]/bookmark`) and build `/dashboard/bookmarks` Inspiration Vault page.
- [ ] Verify debounced autosave continues to preserve form state with zero data loss.
