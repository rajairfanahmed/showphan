# Out-of-Scope Decision: Native Video Hosting

**Decision Date:** October 9, 2026  
**Status:** Rejected / Out of Scope for Showphan Core  
**Topic:** Direct MP4/WebM video upload and native streaming player

---

## Rationale for Rejection

1. **Mission Alignment:**  
   Showphan is intentionally designed as a high-density, single-link developer portfolio platform. Its core value proposition is speed, clarity, and instant visual impact through verified 16:9 cover images and live links.
2. **Storage and Bandwidth Costs:**  
   Direct video hosting incurs massive egress costs, transcoding compute overhead (FFmpeg queues), and multi-bitrate HLS streaming infrastructure. Cloudflare R2 and Neon PostgreSQL are optimized for static WebP image objects and relational project metadata.
3. **Superior Alternatives Exist:**  
   Developers can embed external YouTube, Loom, Vimeo, or interactive demo links in the markdown description, or link directly to live deployed applications via the `liveUrl` button.

---

## Permitted Evolution
If video demonstrations are needed in future releases, Showphan will support lightweight, privacy-respecting embeds (e.g. YouTube nocookie or Loom embed iframes) rather than native video file hosting.
