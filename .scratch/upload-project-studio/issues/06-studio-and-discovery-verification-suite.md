# 06: End-to-End Studio & Discovery Verification Test Suite

**What to build:** An automated test suite in `tests/` verifying the 5-rule Quality Gate invariants, upload cancellation abort mechanics, 5-tag limit validation, and real-data homepage feed querying.

**Blocked by:** 01: Real-Time Homepage Feed Data Hydration, 05: Sticky Floating Action Dock & Quality Gate Publishing Engine

**Status:** ready-for-agent

- [x] Unit test Quality Gate evaluation for 0/5, partial, and 5/5 rules
- [x] Integration test for project drafting and publishing transitions
- [x] Test tag tokenizer logic ensuring max 5 tags and `#` prefix format
- [x] Test homepage explore querying with real database records and fallback handling
- [x] Run full test suite and confirm 100% pass rate
