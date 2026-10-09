# Phase 8: Frontend Implementation

Build the frontend module by module, test-first. Follow the tickets from Phase 4.

## Inputs

`.scratch/<feature>/issues/` (tickets), `design-spec.md` (UI design, API contracts), `CODING_STANDARDS.md`.

## Process

### 1. Pick a ticket from the frontier

Same as backend: grab the first unblocked, unclaimed ticket. Mark it claimed.

### 2. Prototype uncertain UI

If you're unsure what a page should look like, build a prototype first:

- Generate 3 radically different UI variants on the same route
- Switch between them via `?variant=A|B|C` with a floating bottom bar
- Variants must differ in **structure** (layout, information hierarchy, primary affordance), not just styling
- User picks one or mixes elements ("header from B, sidebar from C")
- Fold the winner into real code. Delete the rest.

### 3. TDD loop: Red → Green → Refactor

Same discipline as backend. Test observable user behavior through public interfaces:

```
// GOOD: Tests what the user sees
test("shows error when email is invalid", () => {
  render(<RegisterForm />);
  fireEvent.change(getByRole('textbox', { name: /email/i }), { target: { value: 'bad' } });
  fireEvent.click(getByRole('button', { name: /submit/i }));
  expect(getByText(/valid email/i)).toBeInTheDocument();
});
```

### 4. Implementation order per ticket

Build each behavior top-down through the layers:

1. **Page/Route** → the page component, route registration
2. **Layout** → page structure, sections, responsive grid
3. **Components** → reusable UI elements (forms, cards, tables, modals)
4. **Form/UI logic** → form state, validation, submission handling
5. **Client-side validation** → validate before sending to API
6. **State management** → local state, shared state, server state (React Query, SWR, etc.)
7. **API service layer** → functions that call backend endpoints
8. **Response handling** → map API responses to UI state (loading, success, error, empty)

### 5. Handle every interaction state

Every user-facing component must handle:
- **Loading.** Skeleton, spinner, or placeholder while data loads
- **Success.** The expected content rendered correctly
- **Error.** Clear error message with recovery action
- **Empty.** Meaningful empty state ("No orders yet. Create your first order.")
- **Disabled.** Buttons disabled during submission with visual feedback
- **Auth.** Protected routes redirect unauthenticated users

### 6. API integration

- API calls go through a service layer, never directly from components
- Handle every response code the backend can return
- Map error responses to user-facing messages
- Implement retry logic for transient failures
- Cancel pending requests on unmount

### 7. Responsiveness and accessibility

- Test at mobile, tablet, and desktop breakpoints
- Keyboard navigation works for all interactive elements
- Screen reader labels on all inputs and buttons
- Color contrast meets WCAG AA

### 8. Commit and advance

Same as backend: Conventional Commits, mark ticket resolved, advance the frontier.

## Completion Criterion

All frontend tickets are resolved. Every acceptance criterion passes. Every interaction has loading, success, error, and empty states. No API data reaches components without going through the service layer. Responsive at all breakpoints.

## Next Phase

→ `9)Integration(Testing).md`