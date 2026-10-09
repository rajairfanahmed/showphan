# 🌟 Showphan

> **The Single-Link Showcase for Developers to Turn Repositories into Proof-of-Work.**

[![Production Deployment](https://img.shields.io/badge/Production-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://showphan.vercel.app)
[![Version](https://img.shields.io/badge/Version-1.0.0-amber?style=for-the-badge)](https://github.com/rajairfanahmed/showphan/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Creator](https://img.shields.io/badge/Architect-Raja%20Irfan%20Ahmed-black?style=for-the-badge&logo=vercel)](https://rajairfanahmed.vercel.app)

---

## 📖 Overview

**Showphan** is a free, open-source single-link developer portfolio platform created by [**Raja Irfan Ahmed**](https://rajairfanahmed.vercel.app). It bridges the communication gap between software developers and busy, non-technical stakeholders (recruiters, clients, hiring managers).

Rather than forcing visitors to wade through raw code repositories or flat bullet points on a resume, Showphan gives every developer a high-fidelity showcase link (`showphan.com/<username>`) with verified proof-of-work:
- 🖼️ **16:9 Visual Proof:** High-resolution cover images with an interactive lightbox viewer.
- ⚡ **5-Rule Quality Gate:** Zero half-baked placeholders; only complete projects with titles, 140-char summaries, cover images, technology badges, and live/source links can be published.
- 🎨 **Standardized Tech Stacks:** 51+ curated technologies rendered with official icons directly from an offline SVG bundle (zero runtime external CDN dependencies).
- 🔒 **Direct-to-Storage Uploads:** Client-side WebP compression (< 1MB) with presigned, short-lived URLs directly to Cloudflare R2.
- 🚀 **Sub-Second Performance:** Next.js 16 App Router with dynamic SSR, Neon pooled PostgreSQL, and Tailwind CSS 4.

---

## 🚀 Live Demo

- **Production URL:** [https://showphan.vercel.app](https://showphan.vercel.app)
- **Object Storage:** Cloudflare R2 CDN (`pub-7951652fb9484b909e8f3989e79f7111.r2.dev`)

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.4.0 (App Router)** | Turbopack compilation, React 19 Server Components, Streaming SSR |
| **Database** | **Neon PostgreSQL + Prisma ORM 7** | Serverless PostgreSQL with `@prisma/adapter-pg` connection pooling |
| **Authentication** | **Better Auth** | GitHub OAuth with minimal public scope (`read:user`), session cookies |
| **Object Storage** | **Cloudflare R2 (S3-Compatible)** | Direct client-to-bucket uploads via presigned URLs; zero bandwidth fees |
| **Styling** | **Tailwind CSS 4** | High-performance CSS engine with custom design tokens |
| **Iconography** | **Iconify Offline Bundle** | 169.8 KB local JSON bundle of SVGs for 51+ technologies; zero CDN calls |
| **Sanitization** | **react-markdown + rehype-sanitize** | Defense-in-depth HTML stripping for user-generated markdown |
| **Validation** | **Zod 4.6** | Strict runtime schema validation for inputs and mutations |

---

## ✨ Key Features

### 1. 5-Rule Publishing Engine (Quality Gate)
Showphan enforces engineering excellence through a real-time 5-rule checklist. A project can only be published when it satisfies:
1. **Title:** Clean, descriptive headline (3–100 characters).
2. **Summary:** Concise elevator pitch (10–140 characters, plain text).
3. **Cover Image:** 16:9 crop, converted client-side to WebP format (≤ 1.0 MB).
4. **Technology Stack:** At least one tagged technology with an official icon badge.
5. **Verified Links:** At least one of Live Demo URL or Source Repository URL.

### 2. Real-Time Split-Screen Project Studio
- Desktop dual-column interface with live form inputs on the left and synchronous card/page previews on the right.
- Mobile view with fluid "Edit" and "Preview" tab switching.
- Debounced autosave with visual status indicators (`"Saved at 12:45 PM"`).
- Optional **1-Click GitHub Repository Import** to auto-populate title, summary, language, and repository links from your public GitHub profile.

### 3. Developer Showcase & Standalone Pages
- **Public Profile (`/<username>`):** Features avatar, bio (≤ 160 chars), up to 6 highlighted "Featured Projects", and a responsive project grid.
- **Project Detail (`/<username>/<project-slug>`):** High-resolution cover image with full-screen lightbox, tech stack badges, safe markdown description, role details, key learnings, and outbound links flagged with `rel="ugc nofollow noopener noreferrer"`.

### 4. Privacy & Developer Controls
- **Search Engine Indexability:** Toggle on/off per profile (`sitemap.xml` inclusion and dynamic `noindex` robots tags).
- **Dark-Default Design System:** Sleek, accessible Zinc-950/Zinc-900 palette with radiant Amber-500 (`#F59E0B`) accents, with instant Light/Dark/System switching.
- **Account Data Control:** Full account deletion with permanent purging of associated database records and Cloudflare R2 assets.

---

## 🏗️ Architecture

```
Showphan Architecture
├── Browser Client
│   ├── Better Auth Client Session
│   ├── Canvas 16:9 WebP Compressor (< 1MB)
│   └── Offline TechBadge Renderer (src/generated/icons.json)
│
├── Next.js 16 App Router (Vercel)
│   ├── Route Handlers (/api/projects, /api/me, /api/uploads)
│   ├── Dynamic Metadata Engine (Open Graph & Twitter Cards)
│   └── Isolated Client/Server Boundaries (src/lib/storage/urls.ts)
│
├── Object Storage (Cloudflare R2)
│   └── Presigned Direct PUT URLs (AWS SDK S3 Client)
│
└── Database (Neon PostgreSQL)
    └── Prisma ORM 7 + @prisma/adapter-pg Connection Pool
```

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js:** `v20.x` or `v22.x`
- **npm:** `v10.x` or later
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajairfanahmed/showphan.git
   cd showphan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

   # Better Auth
   BETTER_AUTH_SECRET="your-32-byte-random-secret"
   BETTER_AUTH_URL="http://localhost:3000"

   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-oauth-client-id"
   GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"

   # Cloudflare R2 Storage
   R2_ACCOUNT_ID="your-cloudflare-account-id"
   R2_ACCESS_KEY_ID="your-r2-access-key-id"
   R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
   R2_BUCKET_NAME="showphan"
   R2_PUBLIC_BASE_URL="https://pub-7951652fb9484b909e8f3989e79f7111.r2.dev"
   ```

4. **Initialize Database Schema & Starter Catalog:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing, Quality & Observability

Showphan includes 4 automated verification suites covering unit logic, database integrity, storage validation, end-to-end integration, and telemetry:

```bash
# Run all 4 test suites (49/49 assertions pass)
npm test

# Verify TypeScript types (0 errors)
npm run typecheck

# Run ESLint (0 errors)
npm run lint

# Compile production Turbopack bundle
npm run build
```

### Observability & Health Probes
- **Liveness & Health Probe:** [`/health`](https://showphan.vercel.app/health) (reports uptime, Neon DB query latency, and R2 credentials).
- **Readiness Probe:** [`/ready`](https://showphan.vercel.app/ready) (verifies database readiness to handle live user traffic).
- **Distributed Request Tracing:** Every request is tagged with an `x-request-id` via the Next.js 16 Proxy layer (`src/proxy.ts`).
- **Structured JSON Logging:** Centralized logging with automated PII & credential redaction (`src/lib/logger.ts`).

---

## 📂 Project Structure

```
showphan/
├── prisma/
│   ├── schema.prisma            # Prisma ORM 7 schema (Neon PostgreSQL)
│   └── seed.ts                  # 51 starter technologies seed script
├── scripts/
│   └── bundle-icons.ts          # Offline SVG extractor for Iconify
├── src/
│   ├── app/
│   │   ├── [slug]/              # Public profile & project detail pages
│   │   ├── api/                 # Next.js App Router API endpoints
│   │   ├── dashboard/           # Management dashboard & split-screen editor
│   │   ├── settings/            # Profile settings & privacy controls
│   │   ├── error.tsx            # App-level error boundary with digest display
│   │   ├── global-error.tsx     # Root layout fatal error boundary
│   │   ├── globals.css          # Design system variables & utilities
│   │   ├── layout.tsx           # Root layout with header/footer shell
│   │   ├── page.tsx             # Marketing landing page & showcase
│   │   ├── robots.ts            # Dynamic robots.txt
│   │   └── sitemap.ts           # Dynamic XML sitemap
│   ├── components/              # Shared UI components (TechBadge, Header, etc.)
│   ├── generated/               # Offline icons bundle (icons.json)
│   ├── lib/                     # Core logic (auth, prisma, storage, projects, logger)
│   └── proxy.ts                 # Next.js 16 request interceptor & x-request-id tracer
├── tests/                       # 4 automated test suites (49/49 passing assertions)
│   ├── backend-suite.test.ts
│   ├── e2e-integration.test.ts
│   ├── requirements-verification.test.ts
│   └── monitoring-observability.test.ts
├── docs/                        # Architecture records, monitoring plan, health audit
│   ├── deployment-runbook.md
│   ├── monitoring-plan.md
│   ├── release-v1.0.0-notes.md
│   ├── requirements-acceptance.md
│   ├── retrospective-v1.0.0.md
│   └── codebase-health-report.md
├── .out-of-scope/               # Documented rejected concepts & scope rationale
└── Skills/                      # 16-Phase Software Engineering Workflow specifications
```

---

## 🏆 16-Phase Software Engineering Milestone

Showphan v1.0.0 has completed all 16 phases of modern software engineering:
1. Problem Discovery ✅ | 2. Requirements Analysis ✅ | 3. System Analysis ✅ | 4. Design Architecture ✅  
5. Security Spec ✅ | 6. Implementation Strategy ✅ | 7. Test Strategy ✅ | 8. Core Building ✅  
9. Review & QA ✅ | 10. Frontend Assembly ✅ | 11. Verification & Acceptance ✅ | 12. Stabilization ✅  
13. CI/CD Pipeline ✅ | 14. Deployment ✅ | 15. Monitoring & Observability ✅ | 16. Maintenance & Evolution ✅

---

## 📄 License & Governance
 
- 📜 **License**: This project is licensed under the [MIT License](LICENSE).
- 🤝 **Contributing**: Read our [Contributing Guide](CONTRIBUTING.md) to get involved.
- 🛡️ **Code of Conduct**: Review our community [Code of Conduct](CODE_OF_CONDUCT.md).
- 🔒 **Security**: See our [Security Policy](SECURITY.md) for vulnerability reporting.

---

## 👨‍💻 Author & Architecture

Showphan is architected with passion by [**Raja Irfan Ahmed**](https://rajairfanahmed.vercel.app).

- 🌐 **Portfolio**: [rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)
- 🐙 **GitHub**: [@rajairfanahmed](https://github.com/rajairfanahmed)
- 🌟 **Support the Project**: If you find Showphan valuable, please consider giving it a ⭐ on [GitHub](https://github.com/rajairfanahmed/showphan)!
