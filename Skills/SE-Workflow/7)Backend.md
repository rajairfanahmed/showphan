# Phase 7: Backend Implementation

Build the backend module by module, test-first. Follow the tickets from Phase 4.

## Inputs

`.scratch/<feature>/issues/` (tickets from Phase 4), `design-spec.md` (architecture, schema, API contracts), `CODING_STANDARDS.md`.

## Process

### 1. Pick a ticket from the frontier

The **frontier** is the set of tickets with no unresolved blockers. Pick the first one. Mark it as claimed before starting work.

### 2. Understand the ticket

Read its acceptance criteria, the spec, and the relevant parts of `design-spec.md`. Know exactly:
- What this ticket delivers (end-to-end behavior)
- Which DB tables, API endpoints, and business logic it touches
- How it connects to previously completed tickets

### 3. TDD loop: Red → Green → Refactor

For each behavior in the ticket:

**Red.** Write a failing test at the highest seam possible. The test asserts on the behavior the user cares about, not on implementation details:

```
// GOOD: Tests observable behavior
test("user can create an account", async () => {
  const result = await createUser({ email: "a@b.com", password: "secure123" });
  const retrieved = await getUser(result.id);
  expect(retrieved.email).toBe("a@b.com");
});

// BAD: Tests implementation details
test("createUser calls hashPassword", async () => {
  const spy = jest.spyOn(bcrypt, 'hash');
  await createUser({ ... });
  expect(spy).toHaveBeenCalled();
});
```

**Green.** Write the minimum code to make the test pass.

**Refactor.** Clean the code. Tests still pass.

### 4. Implementation order per ticket

Build each behavior bottom-up through the layers:

1. **Model/Entity** → database table, ORM model, types
2. **Repository** → data access (queries behind a clean interface)
3. **Service/Logic** → business rules (pure: no DB writes, no side effects in the decision layer)
4. **Controller/API** → HTTP handler, request parsing, response formatting
5. **Validation** → input validation at the API boundary
6. **Middleware** → auth, rate limiting, error handling

### 5. Mocking rules

Mock only at **system boundaries**:
- External APIs (payment providers, email services, LLM APIs)
- Databases (prefer a test database; mock only when unavailable)
- Time and randomness
- File system (sometimes)

Never mock your own classes, modules, or internal collaborators. If you need to mock an internal thing to test it, the design is wrong. Fix the design.

### 6. Automated checks

Run regularly during implementation:
- **Typechecking** after every significant change
- **Single test file** after each TDD cycle
- **Full test suite** once per completed ticket

### 7. Commit and advance

Commit the completed ticket's work to its branch. Use Conventional Commits:
- `feat: add user registration endpoint`
- `fix: prevent duplicate email registration`
- `refactor: extract password validation to service`

Mark the ticket as resolved. Check if resolving it unblocks new tickets on the frontier. If so, pick the next one and repeat.

## Completion Criterion

All backend tickets are resolved. Every acceptance criterion passes as a green test. Code follows `CODING_STANDARDS.md`. No test mocks internal collaborators. All tests pass. Typechecking passes.

## Next Phase

→ `8)Frontend.md`