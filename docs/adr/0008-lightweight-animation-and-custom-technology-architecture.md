# 8. Lightweight CSS Motion, Custom Technology Fallbacks, and Phased Roadmap

## Context
Following the design and community mechanics decisions, we evaluated the frontend animation architecture and technology catalog extensibility. To win Product of the Year, Showphan must deliver a silky, responsive feel without degrading Core Web Vitals, bloating client bundles, or imposing artificial limits on developers' tech stacks.

## Decision
1. **Zero-JS Overhead Motion (CSS & Tailwind Tokens Only)**: Explicitly rejected heavy runtime animation libraries (such as Framer Motion) in favor of hardware-accelerated CSS transitions (`transform`, `opacity`, `cubic-bezier`), subtle Tailwind utility animations, and CSS keyframe pulses. This preserves sub-second page loads, zero client bundle bloat, and smooth mobile frame rates.
2. **Custom Technology Catalog Extensibility**: Enabled developers to specify custom technologies outside the 51 starter entries, supporting dynamic tag creation and clean styled fallback badges with initials/color accents when official offline SVG icons are unavailable.
3. **Homepage Interactive Showcase Simulator**: Replaced static screenshots in the hero with a live, interactive showcase component that demonstrates the 16:9 lightbox, viewport switching, and tech tags directly to prospective users.
4. **Three-Phase Tracer-Bullet Execution Roadmap**:
   - **Phase A**: Community Discovery Hub (`/explore`, Prisma `Kudos`/`Bookmark` models, Trending algorithm).
   - **Phase B**: Studio Enhancements & Dynamic README SVG Badges (`/api/badge/[slug]`, custom tech tags, lightweight CSS micro-interactions).
   - **Phase C**: Flagship Live Sandbox & Dynamic OpenGraph Engine (multi-device viewport switcher, `@vercel/og` cards).

## Consequences
- Bundle size remains razor-thin with 0 KB animation runtime overhead.
- Lighthouse performance and Core Web Vitals remain at 95–100.
- Developers can showcase emerging or niche technologies without waiting for manual catalog updates.
