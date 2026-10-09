# 09: Settings, Theme Switcher & SEO Engine

**What to build:**
Settings page (`/settings`) for editing display name, bio (≤ 160 chars), refreshing avatar from GitHub, search engine indexing toggle, and full account deletion with confirmation. Global theme switcher (System, Light, Dark as default). SEO engine generating OpenGraph/Twitter Card preview images, JSON-LD structured data (ProfilePage, CreativeWork), dynamic `sitemap.xml`, and `robots.txt` honoring the search visibility switch.

**Blocked by:** 07

**Status:** resolved

- [x] Build `/settings` page with Display Name, Bio counter, read-only immutable Slug, and "Refresh from GitHub" button.
- [x] Implement search engine visibility switch (`search_visible`, default ON); inject `noindex` if OFF or if user has 0 published projects.
- [x] Implement account deletion flow that prompts the user to type their username and cascades removal of projects, R2 images, and account.
- [x] Implement global Theme toggle (Dark default, Light, System) persisting in cookie/storage and updating CSS variables cleanly.
- [x] Build Next.js metadata generators with OpenGraph and Twitter Card tags for Home, Profile, and Project pages.
- [x] Implement dynamic `sitemap.xml` and `robots.txt` excluding dashboard, settings, API routes, and hidden profiles.
