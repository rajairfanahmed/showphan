# Tech Debt Ticket #002: Migrate Raw `<img>` Tags to Next.js `<Image />`

**Priority:** Medium  
**Category:** Frontend Performance / Core Web Vitals  
**Status:** Queued for v1.0.1  
**Target:** Page components displaying avatars and cover images

---

## Current Situation
ESLint currently flags 10 warnings for `@next/next/no-img-element`:
- `src/app/[slug]/[project]/page.tsx` (lines 83, 218)
- `src/app/[slug]/page.tsx` (lines 72, 141, 204)
- `src/app/dashboard/page.tsx` (line 312)
- `src/app/dashboard/project/[id]/edit/page.tsx` (lines 497, 800)
- `src/components/Header.tsx` (lines 101, 177)

These components currently use standard HTML `<img>` elements with CSS sizing to avoid layout shift, but do not take advantage of Next.js automatic image optimization or responsive srcset generation.

---

## Action Plan
1. Remote domains (`avatars.githubusercontent.com` and `pub-7951652fb9484b909e8f3989e79f7111.r2.dev`) are already authorized in `next.config.ts`.
2. Migrate cover images and user avatars to `next/image` with explicit `width`, `height`, and `sizes="(max-width: 768px) 100vw, 800px"` attributes.
3. Verify LCP (Largest Contentful Paint) improvements in Vercel Speed Insights.
