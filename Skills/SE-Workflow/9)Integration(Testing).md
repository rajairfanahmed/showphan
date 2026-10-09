# Phase 9: Integration Testing

Assemble backend and frontend. Verify they work together across every API contract.

## Inputs

Working backend from Phase 7, working frontend from Phase 8, `design-spec.md` (API contracts).

## Process

### 1. API contract verification

For every endpoint:
- Request payload matches the contract (field names, types, required fields)
- Response payload matches the contract (shape, types, nested objects)
- Status codes match the contract
- Error response format matches `CODING_STANDARDS.md`

### 2. Authentication handshake

- Login flow: frontend sends credentials → backend validates → token issued → frontend stores → subsequent requests include token
- Token refresh: expired token → refresh attempt → new token or re-login
- Logout: token cleared on frontend, invalidated on backend
- Protected routes: unauthenticated requests get 401, frontend redirects to login

### 3. Integration test coverage

Write integration tests for:

**Positive flows (happy path):**
- Complete user journeys end-to-end
- Data created on frontend appears correctly in backend
- Backend state changes reflected in frontend

**Negative flows:**
- Invalid payloads return proper error responses and frontend displays them
- Missing auth returns 401 and frontend handles it
- Boundary values (empty strings, max-length, zero, negative numbers)

**State synchronization:**
- Data modified by one action is reflected in subsequent reads
- Concurrent modifications handled (optimistic locking, conflict resolution)

**Network failure simulation:**
- 500 errors: frontend shows error state, offers retry
- 401 errors: frontend redirects to login
- Timeout: frontend shows timeout message
- CORS: requests from allowed origins succeed, others fail

### 4. Defect isolation

When something fails, isolate:
- **Backend controller?** API returns wrong response → fix controller
- **Frontend parser?** API is correct but frontend misreads it → fix client
- **Network/config?** CORS, base URL, proxy → fix configuration

### 5. Fix and re-test

Fix each defect. Re-run the specific integration test. Then run a mini-regression of related flows to ensure the fix didn't break nearby functionality.

## Completion Criterion

Frontend and backend communicate correctly for every API endpoint. Auth flow works end-to-end. Error states propagate correctly through every layer. All integration tests pass.

## Next Phase

→ `10)CodeReview(TechnicalReview).md`