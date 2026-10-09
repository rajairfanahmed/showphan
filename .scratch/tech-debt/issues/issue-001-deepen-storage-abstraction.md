# Tech Debt Ticket #001: Deepen Storage Abstraction Façade

**Priority:** Low  
**Category:** Architecture / Module Depth  
**Status:** Queued for v1.1.0  
**Target:** `src/lib/storage/`

---

## Current Situation
`src/lib/storage/` contains two files:
- `index.ts`: AWS S3 client commands (`PutObjectCommand`, `DeleteObjectCommand`), presigned URL generation, and deletion logic.
- `urls.ts`: Pure URL helper converting raw keys into public Cloudflare R2 CDN URLs.

While this split protects client components from importing `@aws-sdk/client-s3`, a deeper storage provider pattern (e.g., `StorageService` interface with `R2StorageProvider` implementation) would facilitate mocking during unit testing and allow alternative cloud storage adapters (S3, MinIO, Azure Blob) without changing calling code.

---

## Action Plan
1. Create a `StorageAdapter` interface in `src/lib/storage/types.ts`.
2. Implement `R2StorageAdapter` implementing presign, delete, and public URL resolution.
3. Provide a server factory method `getStorage()` and a client URL helper.
