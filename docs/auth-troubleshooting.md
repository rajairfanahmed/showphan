# 🔑 GitHub Authentication Diagnosis & Setup Runbook

## The Problem Encountered in V1
> *"In V1 nothing worked, when I signed in to GitHub, there was error something I don't know and never redirected to any page, no dashboard, no avatar profile etc."*

---

## 🔍 Root Cause Analysis (The 4 Failure Points)

### 1. Database Constraint Violation (Code Bug in V1) — FIXED ✅
- **What happened**: In `prisma/schema.prisma`, `User.slug` is defined as `slug String @unique` (`NOT NULL`). In V1, Better Auth did not map GitHub's profile username to `slug`. 
- **The crash**: PostgreSQL rejected the initial account creation with error code `23502 (not_null_violation)`. The database threw an uncaught error, Better Auth failed to issue a session token, and the user was never logged in.
- **The fix applied**: [src/lib/auth.ts](file:///d:/Showphan/showphan/src/lib/auth.ts) now auto-extracts `profile.login` via `mapProfileToUser` and guarantees a fallback slug via `databaseHooks.user.create.before`.

---

### 2. The `BETTER_AUTH_URL` Redirect Mismatch
- **What happened**: If `BETTER_AUTH_URL` in Vercel is set to `http://localhost:3000` (copied from `.env.example`), GitHub finishes authentication and redirects the user's browser to `localhost:3000` instead of `showphan.vercel.app`.
- **The symptom**: The browser displays a white screen, connection refused, or fails silently without setting the production session cookie.
- **The fix**: Ensure Vercel environment variables have:
  ```env
  BETTER_AUTH_URL=https://showphan.vercel.app
  ```

---

### 3. GitHub OAuth App Authorization Callback URL
- **What happened**: GitHub OAuth requires an exact URL match. If the callback URL in GitHub developer settings is missing `/github` or has a trailing slash error, GitHub displays an OAuth error screen and aborts.
- **The required settings**:
  - Go to: [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers)
  - Select your Showphan App
  - **Homepage URL**: `https://showphan.vercel.app`
  - **Authorization callback URL**: Must be **EXACTLY**:
    ```
    https://showphan.vercel.app/api/auth/callback/github
    ```
    *(For local testing on localhost: `http://localhost:3000/api/auth/callback/github`)*

---

### 4. Database Schema Tables in Neon (`npx prisma db push`)
- **What happened**: If the Neon PostgreSQL database was never migrated, the tables (`users`, `sessions`, `accounts`, `verifications`, `projects`, `technologies`) do not exist.
- **The crash**: Neon throws `relation "users" does not exist (error 42P01)`.
- **The fix**: Run the schema push command locally or in CI:
  ```bash
  npx prisma db push
  ```

---

## 🛠️ Verification Checklist for Production

| Step | Setting | Correct Value |
| :--- | :--- | :--- |
| **1** | GitHub OAuth Callback URL | `https://showphan.vercel.app/api/auth/callback/github` |
| **2** | Vercel `BETTER_AUTH_URL` | `https://showphan.vercel.app` |
| **3** | Vercel `BETTER_AUTH_SECRET` | 32+ character random hex/base64 string |
| **4** | Vercel `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
| **5** | Vercel `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Client Secret |
| **6** | Vercel `DATABASE_URL` | Neon pooled PostgreSQL connection string |
| **7** | Neon Database Tables | Pushed via `npx prisma db push` |
