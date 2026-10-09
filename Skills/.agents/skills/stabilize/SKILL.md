---
name: stabilize
description: "Phase 12: Regression Testing, Debugging & Module Completion. Use when acceptance is verified and the module needs regression testing, bug fixing, and version baselining."
disable-model-invocation: true
---

Read and follow `SE-Workflow/12)Regression-Debug-MarkComplete.md` completely.

Run full regression suite. For hard bugs: build a tight feedback loop FIRST (one command that goes red on the bug), then hypothesize, instrument, fix with regression test. Sign off QA + Technical + Product. Tag the version. Update README and CHANGELOG.
