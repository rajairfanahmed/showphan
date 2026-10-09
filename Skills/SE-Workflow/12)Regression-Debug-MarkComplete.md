# Phase 12: Regression Testing, Debugging & Module Completion

Stabilize the module. Regression test all changes. Debug hard bugs with discipline. Baseline the release.

## Inputs

Integrated, reviewed, accepted system from Phases 9-11. Full test suite.

## Process

### 1. Full regression suite

Run every test in the project. Verify that recent changes didn't break previously working functionality. If everything passes, skip to step 4.

### 2. Defect triage

If tests fail, for each failure:
1. **Reproduce.** Run the failing test in isolation. Confirm it fails consistently.
2. **Classify.** Is this a new bug introduced by recent changes, or a pre-existing issue?
3. **Prioritize.** Blocking (must fix before release) or deferred (tracked for later).

### 3. Debug hard bugs — The feedback loop discipline

For hard bugs that resist quick diagnosis, follow this strict 6-phase process. **Do not skip phases.**

**Phase A: Build a feedback loop.** This is the skill. Everything else is mechanical. You need ONE COMMAND that:
- Goes **red** on this specific bug (catches the exact symptom)
- Is **deterministic** (same result every run)
- Is **fast** (seconds, not minutes)
- Is **agent-runnable** (no human clicking required)

Ways to build it: failing test, curl script, CLI invocation with fixture, headless browser script, replay captured trace, throwaway harness.

**If you catch yourself reading code to build a theory before this command exists, STOP.** No red-capable command, no Phase B.

**Phase B: Reproduce and minimize.** Run the loop. Watch it go red. Then shrink the repro to the smallest scenario that still fails. Cut inputs, config, data — one at a time. Keep only what's load-bearing for the failure.

**Phase C: Hypothesize.** Generate 3-5 ranked hypotheses before testing any of them. Each must be falsifiable: "If X is the cause, then changing Y will make the bug disappear."

**Phase D: Instrument.** One variable at a time. Prefer debugger breakpoints over logs. Tag every debug log with `[DEBUG-xxxx]` for cleanup.

**Phase E: Fix with regression test.** Write the regression test before the fix. Watch it fail. Apply the fix. Watch it pass. Re-run the full feedback loop.

**Phase F: Cleanup.** Remove all `[DEBUG-xxxx]` instrumentation. Delete throwaway harnesses. Confirm the original repro no longer reproduces.

### 4. Module completion sign-off

Multi-dimensional sign-off:

- **QA:** All tests green. Defect log empty. No outstanding regressions.
- **Technical:** Code clean. Architecture sound. No shortcuts that need revisiting.
- **Product:** Behavior matches acceptance criteria. User experience verified.

### 5. Baseline the release

Freeze and record:
- **Version:** Semantic version tag (e.g., `v1.0.0`, `v1.1.0`)
- **Commit hash:** The exact commit this baseline points to
- **Branch state:** All work merged to main or integration branch
- **Changelog entry:** What changed, what was fixed

```
git tag -a v1.0.0 -m "Module 1: User Authentication"
```

### 6. Update documentation

- Update README.md with the completed module's information
- Update CHANGELOG.md with the release entry

## Completion Criterion

All tests pass. Defect log is empty. Module is baselined with a version tag. README and CHANGELOG updated. No outstanding regressions.

## Next Phase (for the completed module)

→ `13)CI-CD.md`

## Next Module

If more modules remain, return to **Phase 1** (`1)Problem.md`) for the next module. Each module cycles through all 16 phases independently.