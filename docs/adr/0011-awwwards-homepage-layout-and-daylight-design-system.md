# 11. Awwwards Homepage Layout and Daylight Design System

Date: 2026-10-10

## Status

Accepted

## Context

Showphan's previous homepage layout suffered from critical responsiveness and aesthetic defects:
1. **Card Clipping and Wrapping**: Enforcing rigid 3-column media queries (`xl:grid-cols-3`) on standard desktop viewports (1280px–1440px) with an expanded 240px sidebar squeezed the feed into ~960px. This restricted cards to ~310px width, causing author metadata to wrap onto orphan lines, clipping bottom HUD action metrics (`👁 3.`), and pushing the Share button off-screen.
2. **SaaS Aesthetic Fatigue**: Standard dark/light tech palettes with enterprise gray borders and generic amber/orange accents failed to reflect an award-winning (Awwwards Site of the Year caliber) developer discovery showcase.
3. **Cluttered Media**: Watermarks, labels, and badges superimposed on the 16:9 cover image degraded preview aesthetics and distracted from the developer's creative work.

## Decision

We redesigned the Showphan homepage with an art-directed, Awwwards-caliber architecture:

1. **Intrinsic Fluid Grid**: Replaced rigid viewport column breakpoints with an intrinsic container-aware CSS Grid:
   ```css
   grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
   ```
   Every card is guaranteed a minimum width of 360px. When the sidebar collapses, the grid seamlessly expands from 2 to 3 (or 4 on ultra-wide) columns with fluid spring transitions.
2. **Ceramic Daylight Color System (Zero Orange)**: Established a high-fashion, European digital gallery palette:
   - **Base Canvas**: Soft silk mineral (`#f5f6fa`), eliminating glare while providing tactile depth.
   - **Card Surfaces**: Floating ceramic white (`#ffffff`) with subtle hairline specular borders (`#e2e5ef`) and diffuse ambient occlusion shadows.
   - **Typography**: Deep sculptural obsidian ink (`#0a0d14` for headings, `#4a5060` for descriptions) delivering WCAG AAA contrast without harsh black glare.
   - **Accent Color**: **Electric Klein Cobalt (`#0052ff`)**, completely eliminating orange/amber tones in favor of an iconic, prestigious creative identity.
3. **Pristine 16:9 Media**: Enforced an unobstructed 16:9 cover preview area devoid of all text overlays, watermarks, or badge stamps.
4. **Structured Card Hierarchy**:
   - **Cover Image**: Unobstructed 16:9 media with subtle `1.02x` cinematic hover scaling.
   - **Launch & Attribution Strip**: Positioned immediately below the image, pairing creator attribution (`by @author • date`) on the left with the status badge and `Visit App ↗` pill on the right in a balanced single row.
   - **Action Bar HUD**: Formatted numerical metrics (`1.2k`), container query hiding non-essential views on compact widths, and guaranteed visibility for all 5 primary interactive actions.
5. **Mobile Responsiveness**: Single-column layout starting from 320px with a floating frosted `MobileNavigationDock` at `bottom-4` and feedback trigger floating safely at `bottom-20 right-3.5`.

## Consequences

- Cards never clip, wrap awkwardly, or overflow across any viewport from 320px up to 4K.
- Guaranteed 360px+ breathing room per card eliminates HUD congestion.
- The platform achieves a distinctive, award-winning editorial aesthetic that stands out from typical SaaS platforms.
