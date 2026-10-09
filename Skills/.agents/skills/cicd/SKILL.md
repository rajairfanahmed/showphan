---
name: cicd
description: "Phase 13: CI/CD Pipeline. Use when the module is stabilized and needs an automated build-test-deploy pipeline."
disable-model-invocation: true
---

Read and follow `SE-Workflow/13)CI-CD.md` completely.

Set up: branching strategy, build pipeline (lint → typecheck → test → build → push artifact), quality gates (no merge without green), environment promotion (dev → staging → prod), secrets management. Generate the actual pipeline config file.
