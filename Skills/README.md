# Software Engineering Workflow

A complete, 16-phase workflow for building full-stack AI/ML web applications from idea to production.

## Quick Start

```
/workflow    → See all commands and where you are
/discover    → Start here with your idea
```

## Commands

| Command | Phase | What It Does |
|---------|-------|-------------|
| `/workflow` | — | Show all commands, determine where you are |
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

## How to Use

### New project

```
/discover        → Define the problem
/requirements    → Extract user stories
/analyze         → Audit and model
/plan            → Break into tickets
/design          → Architecture and contracts
/security        → Auth and protection
/backend         → Build backend (TDD)
/frontend        → Build frontend (TDD)
/integrate       → Test together
/review          → Code review
/verify          → Acceptance testing
/stabilize       → Tag v1.0.0
```

### Building module by module

Each module cycles through the commands independently:

```
Module 1: User Auth
  /discover → /requirements → /analyze → /plan → /design → /security
  /backend → /frontend → /integrate → /review → /verify → /stabilize (v1.0.0)

Module 2: Dashboard
  /discover → /requirements → /analyze → /plan → /design → /security
  /backend → /frontend → /integrate → /review → /verify → /stabilize (v1.1.0)

Module 3: AI/ML Pipeline
  /discover → /requirements → /analyze → /plan → /design → /security
  /backend → /frontend → /integrate → /review → /verify → /stabilize (v1.2.0)

After all modules:
  /cicd → /deploy → /monitor → /maintain
```

### When a module is done

After `/stabilize`, the module gets a version tag:
- First module: `v1.0.0`
- Second module: `v1.1.0`
- Bug fixes: `v1.0.1`

Then start the next module with `/discover`.

### After all modules

Run `/cicd` → `/deploy` → `/monitor` → `/maintain` once for the whole project.

### Other situations

| Situation | Command |
|-----------|---------|
| Debug a hard bug | `/stabilize` (skip to debugging section) |
| New feature request | `/discover` |
| Refactor | `/analyze` → `/plan` → `/backend` → `/review` |
| Dependency update | `/stabilize` (test → fix → baseline) |
| Where am I? | `/workflow` |

## Project Structure

When you use this workflow on a project, it creates:

```
your-project/
├── .agents/skills/           ← The /commands (copy from this repo)
├── SE-Workflow/              ← The 16 phase instructions
├── CODING_STANDARDS.md       ← 8 API Laws + 7 Backend Principles
├── GLOSSARY.md               ← Domain terms (created by /discover)
├── docs/adr/                 ← Architecture decisions (created by /discover, /design)
├── .scratch/                 ← Specs and tickets (created by /plan)
│   └── <feature>/
│       ├── spec.md
│       └── issues/
│           ├── 01-<slug>.md
│           └── 02-<slug>.md
├── problem-overview.md       ← Output of /discover
├── requirements.md           ← Output of /requirements
├── system-analysis.md        ← Output of /analyze
├── design-spec.md            ← Output of /design
├── CHANGELOG.md              ← Release history
└── README.md                 ← Project readme
```

## Coding Standards

`CODING_STANDARDS.md` contains **8 API Design Laws** and **7 Backend Principles**, enforced automatically during `/review`.
