# 3. Database Schema and Cascade Deletion Policy

## Context
When a user deletes a project or their entire account, orphaned relational rows or unreferenced media assets in Cloudflare R2 could persist if referential actions and cleanup policies are not explicitly enforced.

## Decision
1. **Cascade in Database:**
   - Deleting a `User` cascades deletion to their `projects`, `sessions`, and `accounts`.
   - Deleting a `Project` cascades deletion to its `project_technologies` join rows.
   - Deleting a `ProjectTechnology` row does NOT delete the master `Technology` catalog entry (`onDelete: Restrict`).
2. **Storage Purge Lifecycle:**
   - Any project deletion triggers an asynchronous background job to purge `cover_image_key` from Cloudflare R2.
   - Replacing a cover image triggers immediate deletion of the preceding key.
3. **Compound Indexes:**
   - Enforce composite uniqueness `@@unique([userId, slug])` so project slugs are unique per developer while allowing duplicate titles across different developers.
   - Add compound indexes `@@index([userId, status, position])` and `@@index([userId, isFeatured])` for optimized dashboard and profile query lookups.

## Consequences
- Clean database state without dangling orphaned foreign keys.
- User account deletion is non-recoverable and strictly removes all related assets.
