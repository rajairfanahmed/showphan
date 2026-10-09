# Phase 3: Analysis

Audit the requirements for contradictions, gaps, and feasibility. Model the system's structure before any design decisions.

## Inputs

`requirements.md` from Phase 2, `problem-overview.md` from Phase 1, `GLOSSARY.md`.

## Process

### 1. Consistency and completeness audit

Read every requirement. Actively look for:

- **Contradictions.** Requirement A says X, Requirement B says the opposite.
- **Missing edge cases.** What happens on failure? On timeout? On concurrent access? On empty data?
- **Untestable NFRs.** If a requirement says "fast" or "secure" without a number, reject it and demand a measurable target.
- **Gaps.** Requirements that reference behavior never specified. User stories with no error-state acceptance criteria.

Surface every finding. Ask the user to resolve contradictions and fill gaps.

### 2. Technical feasibility assessment

Evaluate the validated requirements against real engineering constraints:

- **Architectural bottlenecks.** Database lock contention under load. API rate limits from third parties. Concurrent user scaling limits.
- **Integration risks.** External API reliability. Authentication complexity. Data format mismatches.
- **Technology constraints.** What the chosen stack can and cannot do. Library maturity. Hosting limitations.

If a requirement is technically unviable, say so, explain why, and propose a feasible alternative.

### 3. Domain data modeling

Identify every entity in the system and model their relationships:

- **Entities.** User, Order, Product, Subscription, etc. Use GLOSSARY.md terms.
- **Relationships.** One-to-many, many-to-many, ownership. Which entity owns which?
- **State transitions.** For key entities (Order: draft → placed → paid → shipped → delivered → cancelled). What triggers each transition? What prevents invalid transitions?
- **Data flow.** Where data enters, how it moves between components, where it's stored.

### 4. Component boundary definition

Define the high-level modules of the system using deep-module thinking:

- **Each module** has a small interface (few entry points) and hides a lot of implementation behind it.
- **Seams** between modules are explicit. A seam is where one module ends and another begins.
- **Responsibilities** are clear. Each module owns one area. No responsibility is shared or duplicated.
- **Dependencies** flow one direction. No circular dependencies between modules.

### 5. Produce the deliverable

Write `system-analysis.md` containing:

1. **Audit Findings.** Resolved contradictions, filled gaps, clarified NFRs.
2. **Refined Requirements List.** Requirements updated after the audit.
3. **Domain Data Model.** Entities, relationships, state transitions.
4. **Component Map.** Modules, their responsibilities, their seams.
5. **Feasibility Risks.** Technical risks identified and their mitigations.

## Completion Criterion

No contradictions remain. Every NFR has a measurable target. Data model covers all entities from the requirements. Component boundaries are defined with clear seams. Feasibility risks have mitigations.

## Next Phase

→ `4)Planning.md`
