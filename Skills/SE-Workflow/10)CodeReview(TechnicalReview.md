# Phase 10: Code Review

Rigorous multi-axis review of the integrated codebase. Every defect found here is cheaper than one found in production.

## Inputs

The diff since the integration branch point, `design-spec.md`, `.scratch/<feature>/spec.md`, `CODING_STANDARDS.md`.

## Process

### 1. Set up the review

Identify the fixed point to review from:
- The commit, branch, or tag where work started
- Compute the full diff

### 2. Standards review

Read `CODING_STANDARDS.md`. Check the diff against every standard:

**8 API Laws:**
- Resource-based URLs? No action-based endpoints?
- Predictable naming across all endpoints?
- HTTP methods used correctly?
- Proper status codes? No 200-with-error-in-body?
- Consistent error format?
- Path identifies resource, query filters?
- Versioning handled?
- Consistent casing, dates, pagination?

**7 Backend Principles:**
- Guard clauses? No deep nesting?
- Meaningful names? No `data`, `item`, `temp`?
- External systems behind adapters?
- Invalid states unrepresentable?
- Decisions separated from actions?
- Useful error codes + messages?
- Focused commits?

**General standards:**
- No dead code
- No commented-out code
- No console.log/print statements left
- No hardcoded secrets or credentials
- No duplicated logic across modules
- Types used correctly (no `any` in TypeScript)

### 3. Spec review

Read the originating spec and tickets. Check:
- Does the code implement every acceptance criterion?
- Are there acceptance criteria that aren't covered by tests?
- Does the code do anything the spec didn't ask for (scope creep)?
- Does the behavior match the user stories?

### 4. Architecture review

- Do module boundaries match `design-spec.md`?
- Are seams clean? Does any module reach into another's internals?
- Are dependencies flowing in the right direction?
- Any shallow modules that should be merged deeper?

### 5. Security review

- Input validation at every API boundary?
- SQL injection prevention (parameterized queries)?
- XSS prevention (output encoding)?
- Auth checks on every protected endpoint?
- Sensitive data not logged or exposed in responses?

### 6. Test quality review

- Tests assert observable behavior, not implementation details?
- No mocking of internal collaborators?
- Tests survive internal refactors?
- Edge cases covered?
- No tautological tests (expected value recomputed the same way as the code)?

### 7. Document defects

For each defect found:
- **What:** exact description
- **Where:** which behavior/module
- **Why:** which standard/spec it violates
- **Severity:** blocking (must fix) or suggestion

### 8. Fix and re-review

All blocking defects must be fixed. Re-review the fix. Repeat until zero blocking defects remain.

## Completion Criterion

Zero unresolved blocking defects. All 8 API Laws satisfied. All 7 Backend Principles followed. Every acceptance criterion traced to working code and a passing test. No security vulnerabilities.

## Next Phase

→ `11)RequirementsAcceptance(Verification).md`