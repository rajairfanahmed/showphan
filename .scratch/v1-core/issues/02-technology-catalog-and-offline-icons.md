# 02: Technology Catalog & Offline Icon System

**What to build:**
Standardized technology stack catalog with pre-bundled offline SVG icons. A developer can search from a curated list of ~40 technologies (languages, frameworks, databases, tools) and view both color and monochrome Iconify icons without making runtime external network requests. Includes a reusable multi-select component with a limit of 15 technologies.

**Blocked by:** 01

**Status:** resolved

- [x] Add `Technology` model to `prisma/schema.prisma` and seed the starter list of ~40 technologies.
- [x] Create a build-time icon extraction script (`scripts/bundle-icons.ts`) using `@iconify/utils` to package chosen SVGs into `src/generated/icons.json`.
- [x] Implement `src/lib/catalog/` with offline icon loader using `@iconify/react/offline`'s `addCollection`.
- [x] Build a searchable multi-select UI component with keyboard navigation, clear buttons, and icon previews.
- [x] Enforce the constraint: maximum of 15 technologies selectable per project.
