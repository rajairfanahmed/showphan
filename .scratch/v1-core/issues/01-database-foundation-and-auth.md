# 01: Database Foundation & GitHub Authentication

**What to build:**
End-to-end authentication flow. The developer clicks "Sign in with GitHub" in the header, authorizes with GitHub (public scope), has their account upserted in the Neon database with an immutable profile slug, receives a secure 30-day session cookie, and sees their avatar/menu in the header with Dashboard, Profile, Settings, and Sign out options. Unauthenticated visitors see the public landing header with "Sign in with GitHub".

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Complete `prisma/schema.prisma` with Better Auth core models (`User`, `Session`, `Account`, `Verification`) and Showphan custom fields (`slug`, `github_id`, `bio`, `search_visible`).
- [x] Implement `src/lib/prisma.ts` with Neon `@prisma/adapter-pg` connection pool.
- [x] Push schema to Neon database using `npx prisma db push`.
- [x] Configure Better Auth in `src/lib/auth.ts` with GitHub OAuth provider and Prisma adapter.
- [x] Mount Next.js App Router route handler at `src/app/api/auth/[...all]/route.ts`.
- [x] Create client helper in `src/lib/auth-client.ts`.
- [x] Build global Header component with Showphan logo, GitHub Star button, Theme toggle, and reactive Sign In / Avatar menu.
- [x] Verify sign in redirect, session creation, database user record, and sign out flow.
