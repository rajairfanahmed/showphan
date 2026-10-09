# 🚀 Showphan v1.0.0 Release Notes

**Showphan** — *The Single-Link Showcase for Developers to Turn Repositories into Proof-of-Work.*

- 🌐 **Live Platform:** [https://showphan.vercel.app](https://showphan.vercel.app)
- 📦 **Release Tag:** `v1.0.0`
- 👨‍💻 **Author:** Raja Irfan Ahmed

---

## 🌟 What is Showphan?

Software developers often struggle to convey their real engineering skills to non-technical or time-constrained recruiters, clients, and peers. GitHub repositories hide visual proof behind raw code and text READMEs; LinkedIn resumes flatten projects into vague bullet points; and custom portfolio sites are tedious to build and maintain.

**Showphan** solves this by providing a friction-free, developer-focused portfolio platform where you can publish verified, high-contrast project showcases in under 5 minutes and share a single unified profile link (`showphan.com/<username>`).

---

## ✨ Key Features in v1.0.0

### 🛡️ 5-Rule Publishing Engine (Quality Gate)
Zero half-baked placeholders! A project can only be published when it satisfies:
1. **Title:** Concise, descriptive headline.
2. **Summary:** 140-character elevator pitch in plain text.
3. **16:9 Cover Image:** WebP format, cropped and compressed (< 1.0 MB).
4. **Technology Stack:** At least one tagged technology with an official icon badge.
5. **Verified Links:** At least one of Live Demo URL or Source Repository URL.

### 🖼️ High-Fidelity Visual Proof & Direct Storage
- **16:9 Canvas Resizer:** Automatic client-side crop and WebP compression below 1MB.
- **Direct-to-R2 Presigned Uploads:** Zero-bandwidth uploads directly to Cloudflare R2 via short-lived AWS S3 presigned URLs.
- **Interactive Lightbox:** Full-screen cover image viewer on project pages with keyboard Escape dismissal.

### ⚡ Standardized Technology Catalog & Offline Icons
- **51+ Seeded Technologies:** Covering Frontend, Backend, Databases, Cloud & DevOps, and Developer Tools.
- **Offline Icon Bundle:** Bundled 169.8 KB SVG dictionary rendered via Iconify offline utilities — **zero external CDN calls at runtime**.

### 🛠️ Split-Screen Project Studio
- Desktop dual-pane interface with synchronized live card and page previews.
- Responsive mobile view with dedicated "Edit" and "Preview" navigation tabs.
- Debounced autosave with real-time timestamp status indicator.
- **1-Click GitHub Repository Import:** Instantly prefill project details directly from your public GitHub repositories.

### 👤 Developer Showcase & SEO Engine
- **Public Profile (`/<username>`):** Displays developer bio (≤ 160 chars), up to 6 highlighted Featured Projects, and full project grid.
- **Standalone Project Pages (`/<username>/<project-slug>`):** Detailed view with tech stack, role, markdown description, and learnings.
- **Security First:** User markdown sanitized via `rehype-sanitize`; all external links decorated with `rel="ugc nofollow noopener noreferrer"`.
- **Dynamic Social Cards & SEO:** Automated Open Graph and Twitter Card tags, dynamic XML sitemap, and `robots.txt` honoring profile search visibility settings.

### 🎨 Theme Customization
- Dark theme default with sleek Zinc-950/Zinc-900 surfaces and vibrant Amber-500 (`#F59E0B`) accents.
- Seamless, zero-flicker System / Light / Dark theme toggling.

---

## 🛠️ Tech Stack & Infrastructure

- **Framework:** Next.js 16.4.0 (App Router, Turbopack, React 19)
- **Database:** Neon Serverless PostgreSQL with Prisma ORM 7 (`@prisma/adapter-pg` pool)
- **Auth:** Better Auth (GitHub OAuth with `read:user` public scope)
- **Object Storage:** Cloudflare R2
- **Styling:** Tailwind CSS 4

---

## 🚀 How to Push & Publish on GitHub

To push the clean commit, tags, and CI/CD workflow to your GitHub repository:

```bash
# Push main branch commits
git push origin main

# Push the v1.0.0 release tag
git push origin v1.0.0
```
