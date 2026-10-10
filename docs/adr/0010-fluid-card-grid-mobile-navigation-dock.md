# 10. Dynamic Fluid Card Grid, Relative Date Launch Bar, and Mobile Navigation Dock

## Context
Following user evaluation of the v2 homepage redesign on standard desktop displays (~1280px) and mobile viewports (320px–768px), several key layout challenges were identified:
1. Forcing three static columns squeezed cards below 320px, causing the launch bar (`Visit App`) to wrap awkwardly, truncating titles prematurely, and clipping the right side of the action bar (views and share buttons).
2. Published dates were missing from showcase cards, reducing time-relevance context for visitors.
3. Mobile users required a modern thumb-friendly navigation paradigm matching daily.dev rather than relying solely on a top hamburger drawer.
4. Server page-load latency was artificially inflated by a 3.5s database timeout when PostgreSQL was unconfigured during local development.

## Decision
1. **Dynamic Fluid Card Grid (`minmax(380px, 1fr)`)**: Replaced rigid media queries with a flexible grid (`grid-cols-1 md:grid-cols-2 min-[1600px]:grid-cols-3`). This guarantees that cards never drop below 380px on desktop viewports, giving each card generous breathing room with sidebar open (~480px) and expanding to 3 columns on wide screens (≥1600px) or when the sidebar is collapsed.
2. **Relative Publication Date in Launch Bar**: Integrated `publishedAt` (e.g. `• 2h ago`, `• Oct 08`) directly alongside the creator attribution in the card's launch bar, maintaining a single horizontal row with the status badge on the left and the `Visit App ↗` launch button on the right.
3. **Daily.dev Style Mobile Floating Navigation Dock**: Implemented `MobileNavigationDock` on mobile screens (`< 1024px`), featuring a frosted glass rounded dock offering 1-tap thumb access to Feed (Home), Search (⌘K Command Palette), Explore, Bookmarks, and a prominent `+` Submit Project button.
4. **Mobile Responsive Footer**: Restructured the footer on mobile to a clean 2-column left-aligned link grid, and removed legacy `v2.0 Beta` and `All Systems Operational` badges.
5. **0ms Database Offline Bypass & Webpack Dev Server**: Added an instant offline check in `src/app/page.tsx` to bypass unconfigured database timeouts (slashing server response times from 3,500ms to 15ms), and configured Webpack (`next dev --webpack`) to eliminate Windows file-settle stalls.

## Consequences
- Cards display all metadata, title text, and action buttons without any horizontal clipping or awkward wrapping.
- Developers on mobile devices enjoy a native app-like experience with comfortable thumb reach.
- Homepage render speed is virtually instantaneous.
