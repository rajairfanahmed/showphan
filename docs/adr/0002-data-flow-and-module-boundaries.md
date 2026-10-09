# 2. Data Flow and Module Boundaries

## Context
Showphan must operate within strict free-tier serverless limits (Vercel 10s function timeouts, Neon compute-sleep latency after 5 minutes, Cloudflare R2 request limits). Routing large files or un-cached database reads directly through serverless functions introduces latency and timeout risks.

## Decision
1. **Direct-to-R2 Presigned Uploads:** The browser resizes images to 1600px WebP client-side and uploads directly to Cloudflare R2 via presigned URLs. Vercel serverless functions never receive binary image payloads.
2. **ISR Edge Caching:** Public profile and project pages are served via Incremental Static Regeneration (ISR) at Vercel's Edge, insulating visitors from Neon database sleep cold-starts.
3. **Optimistic Concurrency:** All project mutations check `updated_at` timestamps to avoid silent overwrite collisions across multiple browser tabs.
4. **Deep Module Architecture:** Encapsulate functionality into five isolated modules (`Auth`, `Projects`, `Storage`, `Catalog`, `SEO`) with minimal public interfaces.

## Consequences
- Image processing relies on modern client browser canvas capabilities.
- Public data updates have short eventual-consistency propagation (or on-demand revalidation).
- Clean separation of concerns allows changing storage or auth providers with minimal code friction.
