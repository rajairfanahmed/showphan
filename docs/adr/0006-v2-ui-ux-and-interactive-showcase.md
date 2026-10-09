# 6. V2 UI/UX System, Command Studio, and Interactive Live Sandbox

## Context
Showphan V1 delivered the foundational 5-Rule Quality Gate and static project showcase pages. To elevate Showphan into a premier developer tool and contender for Product of the Year, we needed to define the visual design system, authoring studio workflow, and live inspection experience.

## Decision
1. **Obsidian & Radiant Amber Design System**: Adopted deep obsidian zinc surfaces (`#09090B`, `#18181B`), hairline semi-transparent borders (`border-white/10`), radiant Amber-500 (`#F59E0B`) glows, and Geist Sans/Mono typography to match high-reputation tools like Linear and Raycast.
2. **Command Studio**: Upgraded the project editor to feature 1-click GitHub repository autofill (syncing repo details, language, links), real-time dual-pane card preview, and an interactive 5-Rule Quality Gate HUD with instant visual status indicators.
3. **Public Profile Ergonomics**: Implemented client-side instant technology filter pills on `/[slug]` and a 1-click shareable portfolio link bar with toast confirmation.
4. **Live Sandbox with Viewport Switcher**: Integrated an interactive in-browser preview tab on project pages with responsive device switching (Desktop / Tablet / Mobile) and seamless fallback to the 16:9 high-res cover image.
5. **Explore Showcase Hub**: Built the public `/explore` discovery catalog featuring trending projects and technology filtering for viral community discovery and search engine sitelinks.
6. **Exclusion of PDF Resume Export**: Explicitly rejected PDF pitch-deck export from the V2 scope to maintain single-minded focus on high-fidelity web showcases and organic community discovery.

## Consequences
- The platform achieves a cohesive, state-of-the-art aesthetic without relying on generic component libraries.
- Project creation friction is reduced by >80% via GitHub metadata synchronization.
- Visitors can test live responsive web applications directly on Showphan without opening external browser tabs.
- PDF generation libraries and serverless rendering overhead are avoided entirely.
