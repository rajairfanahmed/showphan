# 🔒 Security Policy

The security of Showphan and its users' proof-of-work portfolios is our top priority. We appreciate the responsible disclosure of security vulnerabilities by security researchers and community developers.

---

## 🛡️ Supported Versions

We provide security patches and updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Showphan:

1. **DO NOT file a public GitHub issue.** Publicly disclosing vulnerabilities exposes developers and portfolios to risk.
2. Report the vulnerability privately to **Raja Irfan Ahmed** via:
   - **Portfolio Contact**: [https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)
   - **GitHub Security Advisories**: Open a private draft security advisory at [github.com/rajairfanahmed/showphan/security/advisories](https://github.com/rajairfanahmed/showphan/security/advisories)
3. Please include:
   - Type of vulnerability (e.g., XSS, SSRF, IDOR, Authentication Bypass)
   - Step-by-step reproduction instructions or Proof-of-Concept (PoC)
   - Affected endpoints or components
   - Impact assessment and suggested mitigations

---

## ⏱️ Response Timelines & SLA

- **Initial Acknowledgment**: Within **48 hours**
- **Assessment & Triage**: Within **5 business days**
- **Fix & Public Advisory**: Coordinated release with reporter credit once verified

---

## 🏛️ Security Architecture Highlights

Showphan enforces multiple layers of defense-in-depth:
- **XSS Prevention**: User-generated markdown in project descriptions is strictly sanitized via `rehype-sanitize` with a restrictive HTML tag allowlist.
- **Link Isolation**: Outbound links are strictly marked with `rel="ugc nofollow noopener noreferrer"`.
- **Short-Lived Presigned URLs**: Cover uploads go directly to Cloudflare R2 via cryptographically signed PUT URLs expiring in 60 seconds.
- **Session Security**: Better Auth session tokens are stored in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
- **Data Protection**: Full account deletion purges database records and associated Cloudflare R2 assets in a cascade.
