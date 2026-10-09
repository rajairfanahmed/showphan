# Phase 2: Requirements Engineering

Transform the validated problem into clear, testable, prioritized requirements.

## Inputs

`problem-overview.md` from Phase 1.

## Process

### 1. Ingest the problem overview

Read `problem-overview.md` completely. Map out the stated problem, users, scope, and constraints. Do not ask about information already documented.

### 2. Grill for requirements

Interview the user in focused rounds. One domain at a time. For every important user need, extract:

- **Functional requirements.** What must the system do? What triggers each action? What information is required? What should happen afterward? What should happen when something goes wrong?
- **Non-functional requirements.** How fast (response time in milliseconds)? How many concurrent users? What uptime? What security level? What accessibility standard? Reject vague words: "fast" becomes "< 200ms p95 latency."
- **Business rules.** Who can perform each action? What conditions must be satisfied? What restrictions exist? How are calculations performed?
- **Data requirements.** What data does the system need? Where does it come from? Who creates, reads, modifies, deletes it? What relationships exist? What is sensitive?
- **Edge cases.** Invalid input. Missing information. Canceled operations. Duplicate requests. Concurrent access. External service failure. Network disconnection. Unauthorized access. Retry scenarios.
- **Constraints.** Budget. Deadline. Tech stack. Existing infrastructure. Third-party APIs. Regulatory requirements.

### 3. Express as user stories with acceptance criteria

Convert every requirement into a user story with testable acceptance criteria:

```
As a [user type],
I want [goal],
so that [reason].

Acceptance Criteria:
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]
```

Each acceptance criterion must be independently verifiable by a test.

### 4. Prioritize

Classify every requirement:
- **Essential:** Must have for launch. System is broken without it.
- **Important:** Should have. Significant user value.
- **Later:** Nice to have. Can wait for a future version.

Consider business value, user impact, urgency, feasibility, and dependencies.

### 5. Validate

Check every requirement against these properties:
- **Correct:** Accurately represents the user's need.
- **Complete:** No missing conditions, error states, or edge cases.
- **Consistent:** No contradictions with other requirements.
- **Unambiguous:** Only one possible interpretation.
- **Feasible:** Technically achievable within constraints.
- **Testable:** Can be verified by a test.

If a requirement fails any check, grill the user until it passes.

### 6. Produce the deliverable

Write `requirements.md` containing:

1. **User Stories** with acceptance criteria (the bulk of the document).
2. **Non-Functional Requirements** (quantified, testable).
3. **Business Rules** (conditions, permissions, calculations).
4. **Data Requirements** (entities, relationships, sensitivity).
5. **Constraints** (tech, timeline, regulatory).
6. **Assumptions** (explicitly stated, marked as validated or unvalidated).
7. **Out of Scope** (from Phase 1, refined here).

### 7. Update domain language

Add any new terms that surfaced during requirements to `GLOSSARY.md`. Sharpen existing terms if the requirements revealed ambiguity.

## Completion Criterion

Every requirement has acceptance criteria a test can verify. No ambiguous language remains. No requirement contradicts another. NFRs have numeric targets. The document traces back to the business goals in `problem-overview.md`.

## Next Phase

→ `3)Analysis.md`
