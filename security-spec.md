# Security Specification: Showphan (Version 1)

This document formalizes the defensive architecture and security controls for Showphan Version 1, addressing OWASP Top 10 vulnerabilities and enforcing defense-in-depth across authentication, authorization, data protection, and external interfaces.

---

## 1. Authentication Design

### 1.1 Strategy: GitHub OAuth 2.0 with Better Auth
- **Provider:** GitHub OAuth strictly requesting minimal public scope: `read:user` (no private repository, webhook, or organization scopes).
- **Identity Key:** Numeric `githubId` (immutable across GitHub username changes).
- **Zero Passwords:** Showphan does not store or process passwords; authentication delegation eliminates credential stuffing, dictionary attacks, and password hashing compromise.

### 1.2 Session Lifecycle & Cookie Security
- **Mechanism:** Server-side database sessions backed by cryptographically signed HTTP-only cookies.
- **Cookie Attributes:**
  ```http
  Set-Cookie: better-auth.session_token=<token>; 
              HttpOnly; 
              Secure; 
              SameSite=Lax; 
              Path=/; 
              Max-Age=2592000;
  ```
  - `HttpOnly`: Completely inaccessible to client-side JavaScript (mitigating XSS session theft).
  - `Secure`: Transmitted strictly over TLS (HTTPS).
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF) on cross-origin requests.
  - `Max-Age`: 30-day sliding session expiration (`2592000` seconds).
- **Logout Flow:**
  - Client invokes `authClient.signOut()`.
  - Server deletes session record from `sessions` table.
  - Session cookie is invalidated with `Max-Age=0`.

---

## 2. Authorization Model & Matrix

### 2.1 Model: Role-Based & Resource Ownership Access Control (RBAC/OAC)
Permissions are enforced server-side before executing any database or storage mutation. Client-side checks are purely for UI responsiveness.

| Resource / Action | Visitor (Unauthenticated) | Developer (Authenticated) | Resource Owner |
| :--- | :---: | :---: | :---: |
| View Public Profile (`/[slug]`) | Allowed (Published only) | Allowed | Allowed (+ Owner Action Bar) |
| View Project Page (`/[slug]/[proj]`) | Allowed (Published only) | Allowed (Published only) | Allowed (Shows draft if owner) |
| Create Project Draft | Denied (`401`) | Allowed (if count < 30) | Allowed |
| Edit Project (`PATCH /api/projects/:id`) | Denied (`401`) | Denied (`403` if not owner) | Allowed |
| Publish/Unpublish Project | Denied (`401`) | Denied (`403` if not owner) | Allowed (Subject to Quality Gate) |
| Delete Project | Denied (`401`) | Denied (`403` if not owner) | Allowed |
| Issue Presigned R2 URL | Denied (`401`) | Denied (`403` if not owner) | Allowed |
| Edit Profile Settings (`PATCH /api/me`) | Denied (`401`) | Denied (Self only) | Allowed |
| Delete Account | Denied (`401`) | Denied (Self only) | Allowed |

### 2.2 Route Protection
- Route handler middleware and Server Component guards inspect session on `/dashboard/*` and `/settings/*`.
- Unauthenticated requests are redirected immediately to `/?error=unauthorized`.

---

## 3. Data Protection & Secrets Management

### 3.1 Data in Transit
- **TLS 1.3:** Enforced via Vercel Edge.
- **HSTS:** Strict-Transport-Security header enabled:
  ```http
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```

### 3.2 Data at Rest & Privacy Minimization
- **Neon Database:** Encrypted at rest via AES-256.
- **Cloudflare R2:** Encrypted at rest.
- **PII Minimization:** We collect only the developer's public display name, public avatar URL, public email (if granted by GitHub), and bio. No sensitive financial, location, or private repository data is ever stored.

### 3.3 Key Management
- Secrets (`DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_SECRET`, `R2_SECRET_ACCESS_KEY`) are injected via Vercel Environment Variables.
- Strict `.gitignore` rules prevent `.env` from ever being checked into source control (enforced by pre-commit check `git check-ignore -v .env`).

---

## 4. Input Validation & Injection Prevention

### 4.1 SQL Injection Prevention
- 100% prevented by Prisma ORM parameterized queries (`@prisma/adapter-pg`). Raw SQL concatenation (`$queryRawUnsafe`) is strictly prohibited.

### 4.2 Cross-Site Scripting (XSS) Prevention
- **Markdown Sanitization:** Project descriptions are parsed via `react-markdown` piped through `rehype-sanitize` with a strict schema:
  - Disallowed tags: `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<svg>`, `<math>`, `<style>`, `<img>`.
  - Allowed tags: `<h3>`, `<h4>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<code>`, `<pre>`, `<blockquote>`, `<a>`.
  - Image markdown (`![]()`) is explicitly stripped; projects have exactly one visual: the validated cover image.
- **Link Sanitization:** 
  - External URLs (`liveUrl`, `repoUrl`) must start with `http://` or `https://` validated by Zod schema regex.
  - Reject `javascript:`, `data:`, `vbscript:`, or relative URIs.
  - All rendered external links automatically receive:
    ```html
    <a href="..." target="_blank" rel="ugc nofollow noopener noreferrer">
    ```

### 4.3 Content Security Policy (CSP) Headers
Enforced globally via `next.config.ts`:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://avatars.githubusercontent.com https://*.r2.cloudflarestorage.com https://*.public.blob.vercel-storage.com;
  font-src 'self';
  connect-src 'self' https://api.github.com https://*.r2.cloudflarestorage.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

---

## 5. API & Storage Security Controls

### 5.1 Cloudflare R2 Presigned Upload Safeguards
- **Upload Method:** Direct client PUT to Cloudflare R2.
- **Presigned URL Expiration:** 15 minutes (900 seconds).
- **MIME Type Whitelist:** `image/jpeg`, `image/png`, `image/webp`.
- **Content-Length Range:** Enforced between 1,024 Bytes and 1,048,576 Bytes (1MB max).
- **Object Key Isolation:** Objects are saved under namespaced prefixes:
  `covers/{userId}/{projectId}_{timestamp}.webp`
  preventing developers from overwriting other developers' assets.

### 5.2 Rate Limiting
- **Presigned Upload URLs:** Max 5 requests / minute per user.
- **Draft Autosave / Updates:** Max 30 requests / minute per user.
- **Public Profile Scrapes:** Max 120 requests / minute per IP.
- **GitHub Repository Import:** Max 10 requests / minute per user.

### 5.3 Optimistic Concurrency Control
- All project updates compare `clientUpdatedAt` against database `updatedAt`. If mismatched, the server rejects with `409 Conflict`, preventing silent multi-tab overwrites.

---

## 6. AI/ML Security
- **Version 1 Scope:** Showphan Version 1 does not integrate generative AI, LLM completions, or ML inference.
- **Threat Status:** Prompt injection, training data poisoning, and model inversion attacks are Not Applicable (N/A) for V1.

---

## 7. Security Verification Checklist

| Security Check | Expected Outcome | Verification Tool |
| :--- | :--- | :--- |
| **XSS Payload in Markdown** | `<script>alert(1)</script>` stripped completely. | Vitest / Jest unit test |
| **Malicious URL Scheme** | `javascript:alert(1)` rejected by Zod schema. | Zod validation test |
| **Unauthorized Project Mutation** | User A editing User B's project returns `403 Forbidden`. | Integration test |
| **Excessive File Size Upload** | Uploading > 1MB returns `400 FILE_TOO_LARGE`. | API test |
| **Public Secret Leakage** | `git log` and API responses contain 0 keys or tokens. | GitGuardian / Trufflehog |
| **Security Headers Audit** | Grade A+ on SecurityHeaders.com. | Securityheaders.com |
