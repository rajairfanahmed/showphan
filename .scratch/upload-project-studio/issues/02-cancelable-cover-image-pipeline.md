# 02: Cancelable 16:9 Cover Image Pipeline with Circular Progress Ring

**What to build:** Direct-to-storage upload using `XMLHttpRequest` with an animated SVG radial progress ring displaying live percentage (`0%` to `100%`) inside the circle, WebP client compression, and an immediate `✕ Cancel` button via `xhr.abort()` that halts transfer and restores previous state.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Client compresses selected image to WebP (max 1600px width)
- [x] Requests presigned PUT URL from `/api/uploads/cover`
- [x] Uploads via `XMLHttpRequest` tracking `xhr.upload.onprogress`
- [x] Renders circular SVG progress ring with centered percentage text in Klein Cobalt
- [x] Provides `✕ Cancel` button that calls `xhr.abort()` and restores previous verified cover image
- [x] Replaces previous cover cleanly upon successful 100% upload
