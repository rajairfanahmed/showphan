# Phase 11: Requirements Acceptance & Verification

Verify the software against its specs (verification) and against the user's actual expectations (validation). These are two different things.

## Inputs

`requirements.md` from Phase 2, `problem-overview.md` from Phase 1, the integrated working system.

## Process

### 1. Verification — "Did we build the product right?"

Walk every requirement systematically:

**Functional requirements:**
- For each user story, execute the acceptance criteria against the running system
- Pass: the system behaves exactly as specified
- Fail: document the gap, send back for fix

**Non-functional requirements:**
- Performance: measure against quantified targets (response time, throughput)
- Security: test against the security spec from Phase 6
- Scalability: load test if specified
- Each NFR either meets its numeric target or it doesn't. No "seems fast enough."

**Business rules:**
- For each business rule, test the positive case (rule upheld) and negative case (rule violation properly rejected)
- Edge cases: boundary values, empty inputs, maximum loads

### 2. Validation — "Did we build the right product?"

This is harder. It checks whether the system actually solves the original business problem:

**Problem alignment:**
- Re-read `problem-overview.md`. Does this system solve the root problem stated there?
- Do the success criteria from Phase 1 look achievable with this system?

**Real data test:**
- Feed realistic, imperfect data through the system
- Does it handle messy real-world inputs gracefully?
- Does it produce useful outputs for actual users?

**Workflow test:**
- Walk through the primary user journey from start to finish
- Is the workflow intuitive? Or does it require knowledge not in the UI?
- Are there dead ends, confusing states, or missing feedback?

### 3. Gap resolution

For each gap found:
1. Document the discrepancy (expected vs actual)
2. Classify: verification failure (code bug) or validation failure (wrong requirement)
3. If verification: fix the code, re-verify
4. If validation: update the requirement, trace the change through design, fix, re-validate

### 4. Acceptance matrix

Produce a simple matrix:

| Requirement | Type | Status | Evidence |
|-------------|------|--------|----------|
| User can register | Functional | ✅ Pass | Test: auth.test.ts:14 |
| Response time < 200ms | NFR | ✅ Pass | Load test: p95 = 142ms |
| Admin can delete users | Functional | ❌ Fail | Returns 500 |

Every row must be pass before proceeding.

## Completion Criterion

100% of acceptance criteria verified as passing. System tested with realistic data. Business problem from Phase 1 demonstrably addressed. All gaps resolved.

## Next Phase

→ `12)Regression-Debug-MarkComplete.md`