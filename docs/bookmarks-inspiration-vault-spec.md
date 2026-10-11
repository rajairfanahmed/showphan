# Spec: Inspiration Vault (/dashboard/bookmarks)

**Triage Label**: `ready-for-agent`

---

## Problem Statement

Developers browsing Showphan regularly discover standout developer portfolios, novel architectures, and inspiring user interfaces that they wish to save for future reference. While a bookmark database model and toggle endpoint exist, the `/dashboard/bookmarks` page is currently a static, server-rendered view displaying legacy card components with hardcoded amber tones and raw emojis. 

Developers cannot filter their saved projects by technology or category, cannot search their collection by keyword or tags, cannot sort by recent saves or community Kudos, and cannot interactively toggle Kudos or unbookmark projects without full-page reloads. When an accidental unbookmark occurs, there is no way to undo the removal. Furthermore, the absence of a dedicated client-accessible bookmarks API prevents responsive client-side state management.

---

## Solution

Transform `/dashboard/bookmarks` into a high-performance, interactive **Inspiration Vault** that adheres to Showphan's Ceramic Daylight & Obsidian dark mode design system. 

The feature introduces:
1. A dedicated `GET /api/bookmarks` endpoint providing authenticated developers with their complete list of saved projects, enriched with creator attribution, official brand technologies, and personalized Kudos states.
2. An interactive client-side hub (`InspirationVaultClient`) featuring:
   - Dynamic category filter tabs (`All`, `Languages`, `Frontend`, `Backend & Cloud`, `AI & Data`, `Mobile & Systems`) computed automatically from the technologies present in the developer's saved collection.
   - Real-time client-side keyword and `#tag` search filter with immediate debounce.
   - Sort controls toggling between `Recently Saved` and `Most Kudos`.
   - Modern, responsive fluid card grid utilizing the modern tactile [`ProjectCard`](file:///d:/Showphan/src/components/cards/ProjectCard.tsx) component.
   - Optimistic quick Kudos toggling with instant counter increments and haptic-style visual pulse.
   - Optimistic unbookmarking with an interactive 5-second **Undo Toast** allowing immediate recovery of removed projects.
   - An SVG-powered empty state with direct CTA navigation to the Showcase Directory (`/explore`).

---

## User Stories

1. As a Developer, I want to access my saved projects at `/dashboard/bookmarks`, so that I have a centralized private repository of inspirational builds.
2. As a Developer, I want to see an accurate total count of my saved projects in the vault header, so that I understand the size of my curated collection.
3. As a Developer, I want dynamic category filter tabs based on the technologies in my saved collection, so that I can immediately narrow down my view to Frontend, Backend, or AI projects.
4. As a Developer, I want an "All" tab that displays my complete collection of saved projects, so that I can browse without categorical constraints.
5. As a Developer, I want a real-time search input, so that I can instantly find saved projects by typing terms in their title or summary.
6. As a Developer, I want the search filter to match against `#tags`, so that I can locate projects categorized under specific topics like `#devops` or `#web3`.
7. As a Developer, I want to sort my saved projects by "Recently Saved", so that my latest inspirations appear at the very top of the grid.
8. As a Developer, I want to sort my saved projects by "Most Kudos", so that the most community-acclaimed projects in my vault are prioritized.
9. As a Developer, I want to award Kudos directly from within the vault cards without leaving the page, so that I can quickly support creators whose work I have bookmarked.
10. As a Developer, I want the Kudos button to update optimistically with instant visual feedback, so that I experience zero lag when interacting with cards.
11. As a Developer, I want to remove a bookmark directly from within the vault card, so that I can prune projects I no longer need.
12. As a Developer, I want an unbookmarked project to animate out smoothly and present a 5-second Undo Toast, so that I can restore it if I unbookmarked it by mistake.
13. As a Developer, I want clicking "Undo" on the toast to immediately reinstate the project in my view and restore its database record, so that my collection remains intact.
14. As a Developer, I want each saved card to display verified brand technology badges with official Iconify logos, so that I can recognize the tech stack at a glance.
15. As a Developer, I want each card to feature direct links to both the live application and source repository, so that I can inspect the code or test the demo immediately.
16. As a Developer, I want clicking a project's card or cover image to open its full showcase or media lightbox, so that I can examine architecture details and design assets.
17. As a Developer, I want to see creator attribution with the developer's avatar, display name, and profile link on each card, so that I can navigate to their complete profile.
18. As a Developer with zero bookmarks, I want to see a Ceramic Daylight empty state with an SVG bookmark icon and an "Explore Showcase Directory" button, so that I know how to populate my vault.
19. As a Developer whose search query yields zero matches, I want to see a "No matching projects found" notice with a "Clear search" shortcut, so that I can quickly reset my filters.
20. As a Visitor or unauthenticated user attempting to navigate to `/dashboard/bookmarks`, I want to be redirected to the sign-in flow or homepage, so that private user vaults remain secure.

---

## Implementation Decisions

### Architectural Seams & Modules

1. **Backend Retrieval API Endpoint (`GET /api/bookmarks`)**:
   - Create a dedicated route handler supporting authenticated session retrieval via `auth.api.getSession`.
   - Query `prisma.bookmark` ordered by `createdAt: desc`, including `project` with its relation tree: `user` (id, name, displayName, slug, avatarUrl), `technologies` (including `technology`), `kudos` (filtered by current `userId` to derive personalized kudos status), and count aggregates (`kudosCount`, `viewsCount`).
   - Filter returned projects to only include `ProjectStatus.PUBLISHED` (drafts deleted or unpublished by their authors are omitted).
   - Return payload formatted as:
     ```json
     {
       "bookmarks": [
         {
           "id": "cuid-bookmark-id",
           "createdAt": "2026-10-11T09:00:00.000Z",
           "hasGivenKudos": true,
           "project": {
             "id": "cuid-project-id",
             "slug": "project-slug",
             "title": "Title",
             "summary": "Summary",
             "coverImageKey": "...",
             "liveUrl": "https://...",
             "repoUrl": "https://...",
             "tags": ["#react", "#nextjs"],
             "kudosCount": 42,
             "viewsCount": 180,
             "user": {
               "name": "Alex",
               "displayName": "Alex Dev",
               "slug": "alexdev",
               "avatarUrl": "..."
             },
             "technologies": [
               {
                 "technology": {
                   "name": "Next.js",
                   "slug": "nextjs",
                   "iconColor": "logos:nextjs-icon"
                 }
               }
             ]
           }
         }
       ]
     }
     ```

2. **Server Page Orchestration (`src/app/dashboard/bookmarks/page.tsx`)**:
   - Perform initial server-side session check.
   - Fetch initial bookmarks server-side using existing [`getUserBookmarks(session.user.id)`](file:///d:/Showphan/src/lib/projects/bookmark.ts) and user Kudos IDs from `prisma.kudos`.
   - Render the page layout with clean metadata and pass initial data to `InspirationVaultClient` for hydration without initial loading spinners or layout shift.

3. **Client Hub Component (`src/components/bookmarks/InspirationVaultClient.tsx`)**:
   - Client component managing:
     - `items`: Active list of bookmarked project cards.
     - `searchQuery`: Debounced text query filtering titles, summaries, and tags.
     - `activeCategory`: Selected category tab (`All`, or extracted tech categories).
     - `sortBy`: `"recent"` (default) or `"kudos"`.
     - `pendingUndo`: Project data held for undo buffer with a countdown timer.
   - Computes dynamic categories by cross-referencing bookmarked project technologies with `CATALOG_TECHNOLOGIES` category definitions (`Languages`, `Frontend`, `Backend`, `AI & Data`, `Mobile & Desktop`, `Cloud & DevOps`).
   - Optimistic kudos handler calling `POST /api/projects/:id/kudos` and toggling `hasGivenKudos` and incrementing/decrementing `kudosCount`.
   - Optimistic unbookmark handler calling `DELETE /api/projects/:id/bookmark` and launching an undo toast that persists for 5 seconds. If undo is clicked, calls `POST /api/projects/:id/bookmark` and re-inserts the item at its previous index.

4. **Design System & Aesthetics**:
   - Header: Breadcrumb `Dashboard / Inspiration Vault`, Electric Cobalt (`#0052ff`) badge indicating `{count} Saved Projects`, and direct link to `/explore`.
   - Styling: Pure CSS variables (`var(--background)`, `var(--card)`, `var(--foreground)`, `var(--border)`).
   - Layout: Responsive fluid grid using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6`.

---

## Testing Decisions

- **Seam Selection**: Test at the API contract level (`GET /api/bookmarks`, `DELETE /api/projects/:id/bookmark`) and verify external HTTP responses and status codes.
- **Client Behavior**: Validate that category filtering accurately segments projects by stack and that unbookmarking updates the active count and surfaces the undo prompt.
- **Prior Art**: Follow the test pattern established in `src/tests/` and Next.js route handler tests.

---

## Out of Scope

- Creating custom user-named folders or tags inside the vault (collections remain flat with dynamic technology categorization).
- Exporting bookmarks to external CSV/JSON.
- Sharing private bookmark collections publicly (the Inspiration Vault is strictly private to the authenticated developer).

---

## Further Notes

- In alignment with Showphan's domain model, this surface is consistently referred to as the **Inspiration Vault** in all user-facing copy and documentation.
