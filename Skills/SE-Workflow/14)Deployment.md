# Phase 14: Deployment

Release the built artifact to production. Every deployment must be reversible.

## Inputs

CI/CD pipeline from Phase 13. Production-ready artifact. `design-spec.md` (infrastructure blueprint).

## Process

### 1. Pre-deployment checklist

Before deploying, verify:
- [ ] All tests pass on the artifact being deployed
- [ ] Code review approved (Phase 10)
- [ ] Acceptance verified (Phase 11)
- [ ] Regression tests clean (Phase 12)
- [ ] Version tagged with semantic version
- [ ] Database migrations tested on staging
- [ ] Environment variables set in production
- [ ] Rollback plan documented and tested

### 2. Deployment strategy

Choose based on risk tolerance:

- **Rolling update** (default): Replace instances one at a time. Zero downtime. Simple.
- **Blue-green:** Run old and new in parallel. Switch traffic at once. Instant rollback.
- **Canary:** Route 5% of traffic to new version. Monitor. Gradually increase.

### 3. Execute deployment

Via CI/CD pipeline (automated):
1. Build and push the production artifact
2. Run database migrations
3. Deploy to production environment
4. Wait for health checks to pass

### 4. Smoke test production

Immediately after deployment, verify critical paths:
- [ ] Application loads and renders
- [ ] Authentication works (login, token refresh)
- [ ] Primary user journey completes successfully
- [ ] API health check endpoint returns 200
- [ ] Database connectivity confirmed

If any smoke test fails: **rollback immediately**, then investigate.

### 5. Rollback plan

Document exactly how to reverse this deployment:
- Which version to roll back to
- How to reverse database migrations (if reversible)
- How to trigger the rollback (one command)
- Expected time to complete rollback

### 6. Release documentation

After successful deployment:

**Version tag:**
```
git tag -a vX.Y.Z -m "Release: <summary>"
git push origin vX.Y.Z
```

**CHANGELOG.md entry:**
```markdown
## [X.Y.Z] - YYYY-MM-DD
### Added
- Feature description
### Fixed
- Bug fix description
### Changed
- Change description
```

**README.md:** Update with any new features, changed APIs, or setup instructions.

**PR body** (if using PRs for releases):
- Summary of changes
- Before/after evidence for key behaviors
- Link to the spec/tickets this release resolves
- One-way door classification (is this easily reversible?)

## Completion Criterion

Application running in production. Smoke tests passing. Version tagged. CHANGELOG and README updated. Rollback plan documented.

## Next Phase

→ `15)Monitoring.md`
