# 04: Cloudflare R2 Presigned Cover Image Upload & Crop

**What to build:**
Direct-to-storage cover image processing. The developer can drag-and-drop or select an image (JPG, PNG, WebP), crop it in a 16:9 crop frame, client-resize it to max 1600px WebP (<1MB), and upload directly to Cloudflare R2 via an S3 presigned PUT URL. The live preview immediately reflects the new image. Replacing the image or deleting the draft removes the previous image key from R2.

**Blocked by:** 03

**Status:** resolved

- [x] Implement server endpoint `POST /api/uploads/cover` issuing short-lived S3 presigned PUT URLs with content-type and size limits.
- [x] Build client-side 16:9 crop frame and canvas compression component (WebP output, max 1600px width, quality 0.85).
- [x] Add soft resolution warning if selected image width is under 1000px.
- [x] Wire direct browser upload to R2 and link resulting `cover_image_key` to the draft project.
- [x] Implement storage cleanup helper to delete previous cover images from R2 upon replacement.
