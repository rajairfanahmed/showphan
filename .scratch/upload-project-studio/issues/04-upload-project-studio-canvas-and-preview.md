# 04: Upload Project Studio Canvas & Live Card Preview Drawer

**What to build:** A distraction-free single-column editor layout (max-w-3xl) unifying Title, 140-char Summary counter, Markdown description, URL inputs, cover uploader, tech badges, and tags, alongside an interactive "Live Preview" drawer that renders the exact Awwwards 16:9 homepage card in real time as the developer types.

**Blocked by:** 02: Cancelable 16:9 Cover Image Pipeline with Circular Progress Ring, 03: Tech Stack Brand Icon Catalog & #Tags Tokenizer

**Status:** ready-for-agent

- [x] Redesign `/dashboard/project/[id]/edit` and `/dashboard/new` to a focused single-column canvas (`max-w-3xl`)
- [x] Title input with autofocus and validation styling
- [x] Summary input with real-time `x/140` counter and warning when exceeding limits
- [x] Live URL and Repository URL fields with automatic protocol normalization
- [x] Rich Markdown long-form description editor with Write / Preview tabs
- [x] Interactive "Live Preview" button that expands a slide-out drawer or modal rendering the exact homepage `ProjectCard` in real time
