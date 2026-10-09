# 1. Stack and Architecture Selection

## Context
Showphan requires a zero-cost, high-performance web platform for developers to showcase their projects. The platform needs server-side rendering for SEO, seamless OAuth authentication, reliable relational data modeling, and low-latency asset storage.

## Decision
We decided on the following core architecture:
1. **Next.js 16 (App Router)** on Vercel for fast server-side rendering, ISR caching of public profiles, and serverless route handlers.
2. **Neon PostgreSQL + Prisma ORM 7** with `@prisma/adapter-pg` for typed data models and serverless connection pooling.
3. **Better Auth** with GitHub OAuth provider for lightweight, modern session handling without heavy external identity provider dependencies.
4. **Cloudflare R2** via AWS S3 SDK with presigned upload URLs for free-tier image storage and direct browser uploads.
5. **Iconify (Offline Bundle)** for performant, local SVG rendering without run-time network dependencies.

## Consequences
- Single unified codebase without separate backend microservices.
- Relies on Vercel and Neon free-tier limits, requiring client-side image compression and strict database caching.
- Restricts authentication solely to GitHub for Version 1.
