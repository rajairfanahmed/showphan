# Phase 1: Problem Discovery

Discover and define the root business problem before any solution thinking.

## Inputs

The user's raw idea, brief, or problem description.

## Process

### 1. Ingest the idea

Read whatever the user provides. Deeply analyze it to establish baseline context. Do not ask about information already provided.

### 2. Grill relentlessly

Interview the user in focused rounds (3-4 questions per round). Attach a recommended answer to each question so the user can accept in a word or push back with specifics. Cover every angle:

- **Root problem.** What problem actually exists? Use "5 Whys" to dig past symptoms. What happens if nothing is built?
- **Users.** Who has this problem? Primary user, secondary users, different user types. What do they want to accomplish? What are their pain points?
- **Stakeholders.** Who requested this? Who decides? Who operates the system? Conflicting interests?
- **Current state.** How is this problem solved today? What tools exist? What works well? What breaks? Where do users lose time?
- **Desired state.** What does success look like? What outcome do users actually want? What measurable improvement?
- **Scope.** What must this system solve? What will we explicitly NOT build? What can wait for a later version?

Keep grilling until no question remains unanswered. Facts are the agent's job; decisions are the user's.

### 3. Build domain language

As terms surface during grilling, sharpen them. If "user" means three different things, pick one word for each and record them. Challenge fuzzy terms. Resolve overloaded words.

Write terms to `GLOSSARY.md` at the repo root:

```markdown
**Order**:
A request placed by a customer for one or more products.
_Avoid_: Purchase, transaction
```

### 4. Record hard-to-reverse decisions

When a decision is hard to reverse, surprising without context, and the result of a real trade-off, record it as an ADR in `docs/adr/NNNN-slug.md`:

```markdown
# Short title of the decision

Context, what we decided, and why. One to three sentences.
```

### 5. Produce the deliverable

Write `problem-overview.md` containing:

1. **Problem Statement.** The root problem in factual, observable language.
2. **Users and Stakeholders.** Who is affected, who decides, who operates.
3. **Current State.** How the problem is handled today and what's inadequate.
4. **Desired State.** What the environment looks like once solved. Outcomes, not outputs.
5. **Success Criteria.** Measurable indicators that prove the problem is solved.
6. **Scope.** Strict in-scope and out-of-scope lists.
7. **Risks and Assumptions.** What could prevent success, what we're assuming.
8. **Unknowns.** Questions that still need investigation.

## Completion Criterion

A future agent could read `problem-overview.md` and understand the entire business problem without asking a single clarifying question. Every term is defined. Every assumption is explicit. Every unknown is listed.

## Next Phase

→ `2)Requirements.md`
