---
name: workflow
description: "Master router for the AI Software Engineering Workflow. Use when the user asks what to do next, which command to run, or wants an overview of all available phases."
disable-model-invocation: true
---

# AI Software Engineering Workflow

You are the workflow router. Show the user where they are and what command to run next.

## Available Commands

| Command | Phase | What It Does |
|---------|-------|-------------|
| `/discover` | 1 | Grill until the business problem is crystal clear |
| `/requirements` | 2 | Extract testable user stories with acceptance criteria |
| `/analyze` | 3 | Audit for gaps, model the data, define components |
| `/plan` | 4 | Break work into vertical-slice tickets |
| `/design` | 5 | DB schema, API contracts, module design |
| `/security` | 6 | Auth, authorization, data protection, AI safety |
| `/backend` | 7 | Build backend test-first (TDD) per ticket |
| `/frontend` | 8 | Build frontend test-first (TDD) per ticket |
| `/integrate` | 9 | Verify frontend + backend work together |
| `/review` | 10 | Review against standards, spec, and coding laws |
| `/verify` | 11 | Verify against specs + validate against user expectations |
| `/stabilize` | 12 | Regression test, debug, version tag |
| `/cicd` | 13 | Automated pipeline setup |
| `/deploy` | 14 | Release to production |
| `/monitor` | 15 | Logging, alerts, dashboards |
| `/maintain` | 16 | Retro, health checks, evolution |

## Module-by-module flow

Each module cycles through Phases 1-12. After all modules: Phases 13-16 once.

```
Module 1 → /discover → /requirements → /analyze → /plan → /design → /security → /backend → /frontend → /integrate → /review → /verify → /stabilize (tag v1.0.0)
Module 2 → /discover → /requirements → /analyze → /plan → /design → /security → /backend → /frontend → /integrate → /review → /verify → /stabilize (tag v1.1.0)
After all → /cicd → /deploy → /monitor → /maintain
```

## How to determine where the user is

Check which artifacts exist:
- No `problem-overview.md` → Start at `/discover`
- No `requirements.md` → Run `/requirements`
- No `system-analysis.md` → Run `/analyze`
- No `.scratch/<feature>/spec.md` → Run `/plan`
- No `design-spec.md` → Run `/design`
- No security section in design-spec → Run `/security`
- Backend tickets open → Run `/backend`
- Frontend tickets open → Run `/frontend`
- Backend + frontend done → Run `/integrate`
- Integration done → Run `/review`
- Review approved → Run `/verify`
- Verified → Run `/stabilize`

Tell the user exactly which command to run next and why.
