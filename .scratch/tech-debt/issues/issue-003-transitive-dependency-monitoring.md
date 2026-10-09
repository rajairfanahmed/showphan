# Tech Debt Ticket #003: Transitive Dependency Security Patch Tracking

**Priority:** Low  
**Category:** Security & Maintenance  
**Status:** Monitoring  
**Target:** `package.json`, `package-lock.json`

---

## Current Situation
`npm audit` reports 9 high-severity advisories:
1. `braces` (via `fast-glob` in `eslint-config-next`)
2. `deepmerge-ts` (via `@prisma/config` in `prisma` CLI)
3. `mysql2` (via `prisma` CLI for MySQL connectors)

Showphan runs Neon PostgreSQL with pg driver (`@prisma/adapter-pg`). It does not run MySQL, and `braces` is strictly build-time in ESLint.
Running `npm audit fix --force` would downgrade Prisma from v7 to v6 and Next.js from v16 to v14, which would break the entire codebase.

---

## Action Plan
1. Do not use `--force` downgrades.
2. Monitor upcoming minor releases of `@prisma/cli` (v7.11+) and `eslint-config-next` (v16.1+) for updated transitive dependencies.
3. Once upstream packages release the updated sub-dependencies, perform clean `npm update prisma @prisma/client eslint-config-next` and verify with `npm test`.
