# Phase 6: Security Design

Define exactly how the system defends against vulnerabilities. No security decision should be improvised during implementation.

## Inputs

`design-spec.md` from Phase 5, `requirements.md` (security-related NFRs).

## Process

### 1. Authentication design

Specify the complete auth flow:

- **Strategy.** JWT, session-based, OAuth2, or hybrid. Document the trade-off.
- **Token lifecycle.** Issuance, storage (httpOnly cookies vs localStorage), expiration, refresh mechanism.
- **Login flow.** Credentials → validation → token issuance → response.
- **Logout flow.** Token invalidation, session cleanup.
- **Password handling.** Hashing algorithm (bcrypt/argon2), salt rounds, no plain-text storage ever.
- **Multi-factor.** If required, specify the second factor flow.

### 2. Authorization design

- **Model.** RBAC (Role-Based Access Control) or ABAC (Attribute-Based). Define roles and permissions.
- **Enforcement point.** Middleware, guards, or policy layer. Where is the check?
- **Resource ownership.** Users can only access their own resources unless their role permits otherwise.
- **Route protection.** Map every route/endpoint to required permissions.

### 3. Data protection

- **In transit.** HTTPS everywhere. TLS version minimum.
- **At rest.** Sensitive fields encrypted. PII handling policy.
- **Key management.** Where secrets live (environment variables, secret manager). Never in code, never in Git.
- **Backup encryption.** Database backups encrypted.

### 4. Input validation and injection prevention

- **Server-side validation.** Every input validated at the API boundary. Type, format, length, range.
- **SQL injection.** Parameterized queries only. No string concatenation.
- **XSS prevention.** Output encoding. Content Security Policy headers.
- **CSRF protection.** Anti-CSRF tokens for state-changing requests.

### 5. API security

- **Rate limiting.** Requests per minute per user/IP. Backoff strategy.
- **CORS.** Allowed origins explicitly listed. No wildcards in production.
- **Request size limits.** Maximum payload size.
- **Sensitive data in responses.** Never return passwords, tokens, or internal IDs in API responses.

### 6. AI/ML-specific security

If the system integrates AI/ML models:

- **Prompt injection prevention.** User input sanitized before reaching LLM context.
- **Model input validation.** Reject malformed or adversarial inputs.
- **Output filtering.** Model responses checked for sensitive data leakage before returning to user.
- **Data poisoning guards.** Training data integrity validation.
- **Cost controls.** Rate limits on model API calls. Budget caps.

### 7. Produce the deliverable

Append security specifications to `design-spec.md` or write a separate `security-spec.md`:

1. **Auth Flow.** Complete sequence from login to authenticated request.
2. **Authorization Matrix.** Role × resource × permission table.
3. **Data Protection Policy.** What's encrypted, how, where keys live.
4. **Input Validation Rules.** Per-endpoint validation specifications.
5. **API Security Config.** Rate limits, CORS, headers.
6. **AI/ML Security.** Model-specific protections.

## Completion Criterion

Every OWASP Top 10 attack surface has a documented mitigation. Auth flow is fully specified. No secrets in code. Every endpoint has defined permissions. Input validation is specified at every boundary.

## Next Phase

→ `7)Backend.md`
