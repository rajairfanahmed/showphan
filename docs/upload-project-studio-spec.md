# Specification: Upload Project Studio & Real-Time Discovery Feed

## Problem Statement

When a developer attempts to showcase their engineering work on Showphan, the creation and editing experience lacks the visual polish, feedback transparency, and fluidity expected of an award-winning developer platform. 

Specifically:
- When uploading a 16:9 Cover Image, developers see an opaque, indeterminate loading text with zero visibility into transfer progress, and no ability to cancel an upload if they selected the wrong file or an oversized asset.
- The project editor uses rigid desktop split screens that squish forms on laptops and tablets, with no dedicated live preview of how their showcase card will actually look on the homepage feed.
- Action controls (Save Draft and Publish) are either lost off-screen during vertical scrolling or detached from real-time validation, leaving developers confused about why a project cannot be published.
- Technology selection lacks quick-access popular presets and immediate visual brand iconography.
- Free-form tags lack automatic hashtag formatting, resulting in inconsistent label structures.
- On the homepage discovery feed, published projects are not dynamically queried from real database records on the client, causing freshly published projects to feel missing or disconnected from the community feed.

## Solution

A cohesive **Upload Project Studio** and **Real-Time Discovery Feed Engine** that provides:
1. **Interactive Circular Progress & Cancelable Media Pipeline**: Direct client-to-storage upload of verified 16:9 Cover Images featuring an animated SVG radial ring with real-time percentage (`0%` to `100%`) rendered inside, accompanied by a tactile cancel trigger that aborts in-flight network transfers and restores previous state without leaving corrupted data.
2. **Sticky Floating Action Dock**: A viewport-anchored glassmorphic action dock that persists through long scroll journeys, displaying continuous autosave indicators ("Saved" / "Saving..."), a secondary "Save Draft" trigger, and a primary "Publish" button with real-time Quality Gate readiness metrics (e.g., "4/5 requirements satisfied").
3. **Focused Single-Column Studio Canvas with Live Card Drawer**: A clean, distraction-free central column layout coupled with a collapsible live-rendered preview that matches the exact Awwwards 16:9 card anatomy used on the homepage.
4. **Rich Technology Picker with Brand Icons**: Searchable catalog with official brand icons, click-to-remove chips, and quick-add pills for leading ecosystem frameworks.
5. **Enforced #Tags Input Engine**: Tokenized tag field that automatically prepends `#`, converts on Enter or comma, and enforces the platform 5-tag domain limit with an active count badge.
6. **Real Database Discovery Hydration**: The homepage feed dynamically hydrates real published projects from the backend database, ensuring newly published showcases instantly emerge at the top of the community feed.

## User Stories

1. As a developer, I want to see an animated circular progress ring with a numerical percentage inside while my 16:9 Cover Image uploads, so that I have precise feedback on upload duration and network throughput.
2. As a developer, I want an immediate Cancel button during Cover Image upload, so that I can halt accidental uploads of large or incorrect files without waiting for completion.
3. As a developer, I want my client to resize and compress Cover Images to WebP before uploading, so that bandwidth is conserved and image quality remains sharp.
4. As a developer, I want a persistent floating action dock at the bottom of the viewport, so that I can save my draft or publish at any point while scrolling without searching for buttons.
5. As a developer, I want to see continuous autosave feedback ("Saving...", "Saved at 12:45 PM") inside the floating dock, so that I can be confident my work will not be lost if my browser crashes.
6. As a developer, I want to see a live Quality Gate checklist counter (e.g., "3 of 5 rules satisfied") directly on the Publish button, so that I know exactly which requirements remain before publishing.
7. As a developer, I want a clean, single-column workspace that focuses on my content rather than an overloaded split-screen layout, so that writing my project details feels calm and focused.
8. As a developer, I want to toggle a Live Card Preview drawer at any time, so that I can see the exact card card layout, typography, and badges before making my project public.
9. As a developer, I want to type in a technology search field and see official brand icons for frameworks and languages, so that my tech stack is visually recognizable to visitors.
10. As a developer, I want quick-add pills for popular technologies (Next.js, React, TypeScript, Tailwind, Python, Rust, Go), so that I can assemble my stack in a single click.
11. As a developer, I want to remove selected technology badges with a single click, so that I can refine my tech stack easily.
12. As a developer, I want my free-text tags to automatically format with a leading `#` symbol when I hit Enter or comma, so that tags remain clean and consistent.
13. As a developer, I want to see a remaining tag count badge (e.g., "3/5 tags"), so that I do not exceed the platform domain limit.
14. As a developer, I want to remove a tag by clicking its close icon or pressing backspace, so that I can edit my tags smoothly.
15. As a developer, I want to provide live demo and source code URLs with immediate protocol validation, so that visitors can inspect my code and test my app.
16. As a developer, I want a punchy 140-character summary field with real-time character counting, so that my card snippet stays legible across all device screens.
17. As a developer, I want a full Markdown description editor with syntax highlighting and preview tabs, so that I can explain the architecture and key learnings of my project in depth.
18. As a developer, I want my sidebar preference (collapsed vs expanded) to persist across page refreshes, so that my workspace layout remains exactly as I left it.
19. As a visitor, I want the homepage discovery feed to fetch real, active published projects from the platform database, so that I can view genuine peer creations rather than static placeholders.
20. As a visitor, I want the discovery feed to update smoothly without layout shifts when real projects load, so that my reading flow remains comfortable.
21. As a developer, I want newly published projects to immediately appear in the homepage trending and newest feeds, so that my work reaches peers without manual cache invalidation delays.

## Implementation Decisions

### Studio Page & Route Architecture
- The creation flow will be accessible at `/dashboard/new` and transition directly into the unified Studio editor.
- The Studio editor will adopt an editorial single-column canvas (max-width `48rem` / `768px`) with generous spacing, ensuring optimal readability on mobile, tablet, and desktop viewports.
- The live preview of the card will be embedded in a collapsible sliding preview tray, allowing developers to verify card aesthetics without sacrificing form editing space.

### Cover Image Upload & Cancellation Engine
- The upload pipeline will employ direct-to-storage presigned uploads using Cloudflare R2.
- Upload execution will use a managed `XMLHttpRequest` client rather than native `fetch`, allowing fine-grained progress event interception via `xhr.upload.onprogress`.
- Progress state will drive an SVG radial progress ring with stroke dash offset and a central percentage text node.
- Upload cancellation will invoke `xhr.abort()`, clear the local file handle, dismiss the progress ring, and restore any previously verified Cover Image without sending orphaned database mutations.

### Sticky Floating Publish & Quality Gate Dock
- A floating frosted dock (`backdrop-blur-xl`, border glass) will be anchored at `sticky bottom-6` on desktop and docked above the navigation dock on mobile.
- The dock will house:
  - Real-time autosave status badge.
  - Secondary "Save Draft" button for manual explicit commits.
  - Primary "Publish" button connected to the 5-rule Quality Gate evaluation engine.
  - When the Quality Gate is unmet, the Publish button will display an informative counter pill (e.g., `3/5 Ready`) and trigger a tooltip popover highlighting missing criteria (e.g., "Missing 16:9 Cover Image").

### Technology Picker & Tag Tokenizer
- The technology picker will query the centralized technology catalog, displaying SVG logos alongside technology titles.
- Common technologies will be presented as instant 1-click suggestion pills below the search bar.
- The tags input will implement an inline tokenization parser that automatically normalizes strings, trims whitespace, prepends `#`, and prevents duplicate or empty tags while enforcing the 5-tag boundary.

### Homepage Real-Time Data Hydration
- The server entrypoint (`/`) will query published projects using the database explore engine with proper status and visibility filters.
- The client-side feed component will include an SWR / revalidation hook that fetches the latest published showcases from the public `/api/explore` endpoint upon mounting, prepending real showcases to the discovery feed with zero layout shift.

## Testing Decisions

### What Makes a Good Test
Tests must verify externally observable behavior and domain invariants rather than private component states:
- A project must not be allowed to transition from Draft to Published unless all 5 Quality Gate rules are satisfied.
- The upload cancellation mechanism must abort the active network request and leave the project's cover image reference unchanged.
- The tag tokenizer must reject entries beyond the 5-tag limit and enforce `#` prefix consistency.
- The discovery feed API must only expose published projects belonging to search-visible developers.

### Modules to Test
- `QualityGateEngine`: Verification of 0/5, partial, and 5/5 rule evaluations.
- `CoverImageUploadController`: Mocked progress reporting, completion, and abort cancellation flows.
- `TagTokenizer`: Edge cases including comma separation, Enter submission, duplicate prevention, and the 5-tag cap.
- `ExploreQueryEngine`: Multi-criteria sorting (trending score, kudos, newest) and draft filtering.

### Prior Art
- `tests/command-studio-bookmarks.test.ts`: Existing unit and integration tests for Quality Gate HUD logic and API route guards.
- `tests/explore-kudos.test.ts`: Existing test patterns for project queries and trending algorithms.

## Out of Scope

- Multi-image galleries or video cover uploads (strictly limited to exactly one 16:9 Cover Image per project per domain rules).
- Complex custom WYSIWYG rich text block editors (Markdown with live preview remains the canonical standard).
- External team co-authorship or multi-user editing roles (projects belong strictly to a single Developer).
- Automated CI/CD webhooks or GitHub Actions triggers for project publishing.

## Further Notes

- The design tokens and styling will adhere strictly to the **Ceramic Daylight System** (`#0052ff` Electric Cobalt, `#f5f6fa` Silk Mineral, `#ffffff` Ceramic White) with zero orange or amber colors.
- Sidebar state persistence via `localStorage` is already verified and integrated into the layout shell.
