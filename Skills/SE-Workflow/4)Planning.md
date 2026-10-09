# Phase 4: Planning

Break the validated analysis into a buildable plan: a spec and vertical-slice tickets with blocking edges.

## Inputs

`system-analysis.md` from Phase 3, `requirements.md` from Phase 2, `GLOSSARY.md`.

## Process

### 1. Explore the codebase

If this is an existing project, explore the current code to understand:
- Existing seams where tests can hook in
- Prior art (similar features already built)
- Conventions already in use

Prefer existing seams to new ones. The fewer seams across the codebase, the better.

### 2. Write the spec

Synthesize everything into a single spec. Do not interview the user again; synthesize what you already know:

```markdown
## Problem Statement
The problem from the user's perspective.

## Solution
The solution from the user's perspective.

## User Stories
Extensive numbered list. Each: As a <actor>, I want <feature>, so that <benefit>.

## Implementation Decisions
- Modules to build/modify
- Interfaces to define
- Architectural decisions
- Schema changes
- API contracts

## Testing Decisions
- What makes a good test (observable behavior, not implementation details)
- Which modules will be tested
- Which seams tests will hook into

## Out of Scope
What we are not building.
```

Publish to `.scratch/<feature>/spec.md`.

### 3. Break into vertical-slice tickets

Each ticket cuts a narrow but **complete** path through every layer (schema, API, logic, UI, tests):

- **Vertical, not horizontal.** A ticket is never "build the database layer." It is "user can create an account" which touches schema + API + UI + tests.
- **Demoable.** A completed ticket produces something you can see working.
- **One session.** Each ticket fits in a single agent context window.
- **Prefactoring first.** If the code needs restructuring before the feature, that's the first ticket.

### 4. Wire blocking edges

Each ticket declares which other tickets must complete before it can start:

- A ticket with no blockers can start immediately.
- The **frontier** is the set of tickets that are unblocked and unclaimed.
- Work the frontier: grab unblocked tickets first.

### 5. Present and confirm

Show the breakdown as a numbered list. For each ticket:
- **Title:** short descriptive name
- **Blocked by:** which tickets must finish first
- **What it delivers:** the end-to-end behavior this ticket makes work
- **Acceptance criteria:** checkboxes

Ask: Is the granularity right? Are blocking edges correct? Should anything merge or split?

### 6. Publish tickets

Write one file per ticket to `.scratch/<feature>/issues/`:

```markdown
# 01: <Ticket title>

**What to build:** End-to-end behavior from the user's perspective.

**Blocked by:** None (can start immediately) / 01, 02

**Status:** ready

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

Numbered from `01` in dependency order (blockers first).

## Completion Criterion

Every ticket is a vertical slice sized to one session. Blocking edges form a valid DAG (no cycles). Working the frontier builds the feature incrementally. No ticket requires architectural guessing.

## Next Phase

→ `5)Design(Architect).md`