---
name: backend
description: "Phase 7: Backend Implementation. Use when design and tickets exist and the user wants to build the backend. Test-driven development: Red → Green → Refactor per ticket."
disable-model-invocation: true
---

Read and follow `SE-Workflow/7)Backend.md` completely.

Pick tickets from the frontier. TDD loop: write failing test at the highest seam, make it pass, refactor. Mock only at system boundaries. Build: Model → Repository → Service → Controller → Validation → Middleware. Follow `CODING_STANDARDS.md`.
