# Phase 16: Maintenance & Evolution

Keep the codebase healthy. Evolve the product. Learn from every cycle.

## Inputs

Running production system with monitoring from Phase 15. Full project history.

## Process

### 1. Post-release retrospective

After every release, run a retrospective. Look for environment improvements in these categories:

- **Navigation.** Was it hard for the agent to find the right files? Would a pointer in AGENTS.md help?
- **Automated checks.** Did the agent make a mistake an automated check could have caught? Is the repo missing a lint rule, a type check, or a pre-commit hook?
- **Coding standards.** Should `CODING_STANDARDS.md` gain a new rule? Should an existing rule be clarified or removed?
- **Tool economy.** Did the agent make expensive tool calls that could be streamlined?
- **Information access.** Was crucial information unavailable to the agent? Would teeing dev server logs or adding read access to a service help?

Each finding is an actionable improvement, not a vague wish. Implement the improvements before the next cycle.

### 2. Codebase health check

Periodically audit the codebase for architectural health:

- **Shallow modules.** Find modules where the interface is nearly as complex as the implementation. Merge them deeper.
- **Leaky seams.** Find places where one module reaches into another's internals. Close the leak.
- **Missing tests.** Find behaviors with no test coverage. Add tests at the highest seam.
- **Dead code.** Find code that's never called. Delete it.
- **Dependency health.** Check for outdated or vulnerable dependencies. Update and test.

### 3. Bug triage

For incoming bug reports, triage through a clear pipeline:

1. **Needs triage.** New issue arrives. Read it.
2. **Needs info.** If the report is unclear, ask for reproduction steps, expected vs actual behavior, environment details.
3. **Ready.** Once the issue is clear, it's ready for an agent to pick up. Label it, set priority.
4. **Out of scope.** If this is a rejected feature request, document the reasoning in `.out-of-scope/<concept>.md` so it doesn't come back.

### 4. Feature requests

New feature requests cycle back to Phase 1 (Problem Discovery). Each new feature goes through all 16 phases independently, building on the existing codebase.

### 5. Dependency updates

Regular cadence:
1. Audit dependencies for security vulnerabilities
2. Update one dependency at a time
3. Run full test suite after each update
4. If tests fail: investigate, fix, or pin the old version and file a ticket

### 6. Documentation maintenance

Keep living documents current:
- **README.md:** Reflects current state of the project
- **GLOSSARY.md:** New terms added, stale terms removed
- **ADRs:** New decisions recorded, superseded ones marked
- **CODING_STANDARDS.md:** Evolved based on retro findings
- **CHANGELOG.md:** Every release documented

### 7. Technical debt

For debt identified during retro or health check:
1. Write a ticket in `.scratch/tech-debt/issues/`
2. Prioritize against feature work
3. Schedule deepening opportunities (making shallow modules deep) as regular tickets

## Completion Criterion

Retro findings are implemented as environment improvements. Codebase health report produced with actionable items. Incoming issues triaged and queued. Documentation current.

## The Cycle Continues

This is not a terminal phase. The system lives. Bugs arrive, features are requested, dependencies age. Each new piece of work enters at the appropriate phase:

- **New feature:** Start at Phase 1
- **Bug fix:** Start at Phase 12 (build feedback loop → debug → fix → regression test)
- **Refactor:** Start at Phase 3 (analyze → plan → build → review)
- **Dependency update:** Start at Phase 12 (test → fix → baseline)
