# Phase 5: Architecture & Design

Convert validated requirements and analysis into a concrete technical design. Answer every "how" question before writing code.

## Inputs

`system-analysis.md` from Phase 3, `requirements.md` from Phase 2, `.scratch/<feature>/spec.md` from Phase 4, `GLOSSARY.md`.

## Process

### 1. Evaluate architectural drivers

Identify the forces that shape the architecture:
- High-priority NFRs (performance, scalability, security)
- Integration constraints (external APIs, existing systems)
- Deployment target (cloud, serverless, on-prem)
- Team size and skillset (solo developer)

### 2. Choose the architecture pattern

Select the pattern that serves the drivers. Document the trade-off. For full-stack web apps, common patterns:
- Monolith with clean module boundaries (default for solo dev)
- API + SPA with clear separation
- Microservices (only when scaling demands it)

### 3. Design deep modules

For each module from the component map (Phase 3), define its shape using deep-module thinking:

- **Interface:** The public surface. As few entry points as possible. What callers see.
- **Implementation:** Everything hidden behind the interface. The bulk of the work lives here.
- **Seam:** Where this module ends and the next begins. Explicit, narrow, testable.
- **Depth:** A deep module has a small interface and hides a lot. Shallow modules that do little behind their interface should be merged.

For critical interfaces, design it twice: generate 2-3 radically different approaches and compare by depth, locality, and seam placement. Pick the strongest.

### 4. Database schema design

For each entity from the domain data model (Phase 3):

- **Tables.** Name, columns, types, nullable/not-null, defaults.
- **Primary keys.** UUID vs auto-increment. Composite keys only when naturally composite.
- **Foreign keys.** Which table references which. Cascade behavior on delete.
- **Indexes.** Every column used in WHERE, JOIN, ORDER BY gets an index.
- **Constraints.** UNIQUE, CHECK, NOT NULL. Invalid states unrepresentable at the schema level.
- **Migrations.** How to get from the current schema to the new one without downtime.

### 5. API contract design

For every endpoint the system exposes:

```
METHOD /path
Request:  { field: type }
Response: { field: type }
Errors:   { 400: reason, 404: reason, ... }
Auth:     required / public
```

Follow the 8 API Laws from `CODING_STANDARDS.md`.

### 6. Prototype uncertain designs

When you're unsure about a design question, build a throwaway prototype:

- **Logic question** ("does this state machine handle the edge case?"): Single HTML file with buttons that drive the state model. Pure logic module in a `<script>` block, liftable into the real codebase.
- **UI question** ("what should this page look like?"): 3 radically different variants on a single route, switchable via `?variant=A|B|C` with a floating bottom bar. Variants must differ in structure, not just color.

Capture the answer. Delete the throwaway. Keep the validated logic module.

### 7. Record architectural decisions

Every hard-to-reverse decision becomes an ADR in `docs/adr/`:
- Technology choices with lock-in
- Integration patterns between modules
- Boundary and scope decisions
- Deliberate deviations from the obvious path

### 8. Produce the deliverable

Write `design-spec.md` containing:

1. **Architecture Pattern.** Chosen pattern and why.
2. **Tech Stack.** Every technology with its role and version.
3. **Module Design.** Each module's interface, seam, and depth.
4. **Database Schema.** Full schema with types, constraints, indexes.
5. **API Contracts.** Every endpoint with request/response/error shapes.
6. **Infrastructure Blueprint.** Hosting, database, storage, third-party services.
7. **ADR References.** Links to all recorded ADRs.

## Completion Criterion

A developer could build the system from `design-spec.md` without making architectural guesses. Every module's interface is defined. Every API endpoint is specified. Every database table is designed. Every ADR explains why.

## Next Phase

→ `6)Security-Design.md`