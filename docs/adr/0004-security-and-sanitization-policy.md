# 4. Security and Content Sanitization Policy

## Context
Showphan allows developers to write arbitrary Markdown descriptions and link external live websites and GitHub repositories. Without strict sanitization, attackers could embed malicious scripts (XSS), inject `javascript:` links, or upload oversized malicious binary payloads.

## Decision
1. **Strict Markdown Sanitization:**
   - Use `react-markdown` with `rehype-sanitize` enforcing a restrictive HTML tag whitelist.
   - Raw `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, and embedded images (`![]()`) are completely stripped.
   - External links receive `rel="ugc nofollow noopener noreferrer"`.
2. **URL Protocol Restriction:**
   - External URLs must match strict `^https?://` schemes. All `javascript:`, `data:`, and relative schemes are rejected at both Zod validation and rendering boundaries.
3. **Storage Object Key Namespacing:**
   - Cloudflare R2 upload keys are strictly namespaced by user ID: `covers/{userId}/{projectId}_{timestamp}.webp`.
   - Presigned upload URLs enforce a 1MB maximum payload and are restricted to WebP, JPEG, and PNG MIME types.

## Consequences
- Zero arbitrary JavaScript execution inside the portfolio showcase.
- Third-party links do not pass SEO page rank (`nofollow`) and are explicitly identified as user-generated content (`ugc`).
- Isolated asset storage prevents cross-tenant file overwrites.
