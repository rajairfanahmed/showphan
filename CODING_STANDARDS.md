# Coding Standards

These standards are enforced on every code review. Violations must be fixed before approval.

## 8 API Design Laws

1. **Resource-based URLs.** URLs represent resources (`/users`, `/orders`). HTTP methods define operations. Never use action-based URLs (`/getUser`, `/deleteOrder`).

2. **Predictable URLs.** Consistent naming across all endpoints. If you use `/users` in one place, never switch to `/customers` elsewhere for the same resource.

3. **HTTP method semantics.** GET retrieves. POST creates. PUT replaces. PATCH patches. DELETE removes. Idempotent where the standard requires it.

4. **Useful status codes.** Standard HTTP codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500). Never return 200 with an error buried in the body.

5. **Consistent error format.** Every error response follows one shape:
   ```json
   { "error": { "code": "VALIDATION_FAILED", "message": "Email is required" } }
   ```

6. **Path vs query separation.** Path identifies the resource (`/users/123`). Query parameters filter, sort, paginate (`/users?role=admin&sort=name`). Never `/users?id=123`.

7. **Careful versioning.** No breaking changes for existing clients. Version via URL (`/api/v1/`) or header when breaking changes are unavoidable.

8. **Format consistency.** One casing convention for all properties (camelCase). One date format (ISO 8601). One pagination pattern. Across every endpoint.

## 7 Backend Principles

1. **Guard clauses first.** Check conditions upfront. Return early. Never nest logic deeper than two levels.

2. **Name things by meaning.** `pendingOrder`, not `data`. `activeSubscription`, not `item`. Business intent in every name.

3. **External systems behind a boundary.** Wrap every external API behind an adapter. Changes in third-party services never ripple through your codebase.

4. **Invalid states are unrepresentable.** Design data models so invalid states cannot exist. A `CompletedOrder` type that requires a `completedAt` timestamp, not an `Order` with an optional `completedAt` that might be null when status is "completed".

5. **Separate decisions from actions.** Business logic is pure: no database writes, no emails, no side effects. Test decisions without triggering actions.

6. **Useful errors.** Predictable error codes for machines. Human-readable messages for developers. Both, always.

7. **Focused changes.** One concern per commit. One feature per PR. Small diffs review fast and debug faster.
