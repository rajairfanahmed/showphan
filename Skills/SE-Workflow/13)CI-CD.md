# Phase 13: CI/CD Pipeline

Set up automated pipeline from code commit to production-ready artifact. No manual testing in the critical path.

## Inputs

Working, tested, reviewed codebase from Phases 7-12. `design-spec.md` (infrastructure blueprint).

## Process

### 1. Source control strategy

Define and document:
- **Branching model.** Feature branches off `main`. One branch per ticket. Merge via PR.
- **Branch naming.** `feature/<ticket-slug>`, `bugfix/<ticket-slug>`, `release/vX.Y.Z`
- **Commit format.** Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Merge strategy.** Squash merge for feature branches. Merge commit for release branches.

### 2. Build pipeline

Configure the CI pipeline (GitHub Actions, GitLab CI, etc.):

**On every PR to main:**
1. Install dependencies
2. Run linter
3. Run typechecker
4. Run unit tests
5. Run integration tests
6. Build production artifacts
7. Report results

**On merge to main:**
1. All above, plus:
2. Build Docker image / production bundle
3. Push to container registry / artifact storage
4. Tag with version

### 3. Quality gates

No PR merges without:
- All checks green
- Code review approved (Phase 10 completed)
- No unresolved blocking defects

### 4. Environment promotion

Define the promotion path:
- **Development:** auto-deploy on push to feature branch (optional)
- **Staging:** auto-deploy on merge to `main`
- **Production:** manual trigger or auto-deploy with approval gate

### 5. Secrets management

- CI secrets stored in the platform's secret store (GitHub Secrets, etc.)
- Never in code, never in CI config files
- Environment-specific secrets (dev DB vs prod DB) managed separately

### 6. Generate pipeline config

Write the actual pipeline configuration file for the chosen platform.

### 7. Human-only steps

For steps only a human can do (creating cloud accounts, setting up DNS, provisioning databases), generate a precise checklist:

```
□ Create [service] account at [URL]
□ Enable [feature] in the dashboard
□ Copy the API key to CI secret named [SECRET_NAME]
□ Verify by running: curl -H "Authorization: Bearer $SECRET_NAME" [endpoint]
```

Each step must be verifiable.

## Completion Criterion

A push to main triggers an automated pipeline that runs all checks and produces a deployable artifact. No manual testing steps in the pipeline. Secrets managed securely. Quality gates enforce review.

## Next Phase

→ `14)Deployment.md`
