# Phase 15: Monitoring & Observability

Set up observability so you know when things break before your users do.

## Inputs

Deployed production system from Phase 14. `design-spec.md` (infrastructure blueprint).

## Process

### 1. Application logging

- **Structured logs.** JSON format with consistent fields: timestamp, level, message, request_id, user_id.
- **Log levels.** ERROR (something broke), WARN (something unexpected), INFO (important events), DEBUG (development only, never in production).
- **Centralized aggregation.** All logs flow to one place (cloud logging service, ELK, etc.).
- **No sensitive data in logs.** Redact passwords, tokens, PII. Use `<REDACTED>` placeholder.

### 2. Error tracking

- **Unhandled exceptions captured.** Every crash, unhandled rejection, and unexpected error reported automatically.
- **Stack traces preserved.** Source maps uploaded for frontend errors.
- **Grouping.** Same error grouped together, not duplicated per occurrence.
- **Alerting.** New error types trigger notification within minutes.

### 3. Performance metrics

Track and dashboard:
- **API latency.** p50, p95, p99 response times per endpoint.
- **Error rate.** Percentage of requests returning 5xx.
- **Database query time.** Slow queries flagged (> 100ms).
- **Throughput.** Requests per second.
- **Memory and CPU.** Resource utilization trends.

### 4. Health checks

- **Health endpoint.** `GET /health` returns 200 when the application is running.
- **Readiness endpoint.** `GET /ready` returns 200 when the application can serve traffic (database connected, caches warm).
- **Dependency checks.** Health endpoint verifies connectivity to database, external APIs, cache.

### 5. Alerting

- **Error spike.** Error rate exceeds baseline by >2x for 5 minutes.
- **Latency spike.** p95 latency exceeds SLA for 5 minutes.
- **Health check failure.** Health endpoint returns non-200 for 3 consecutive checks.
- **Resource exhaustion.** Memory or CPU above 80% for 10 minutes.
- **Alert destination.** Email, Slack, PagerDuty — whatever you check.

### 6. AI/ML-specific monitoring

If the system includes AI/ML models:
- **Inference latency.** Time per model call. Alert on spikes.
- **Prediction drift.** Monitor model output distribution over time. Alert on significant shift.
- **Input anomalies.** Flag inputs outside the training distribution.
- **Cost tracking.** API call costs per day/week. Budget alerts.
- **Token usage.** For LLM integrations, track tokens consumed.

### 7. Dashboard

Build a single dashboard showing:
- System status (green/yellow/red)
- Key metrics (latency, errors, throughput)
- Recent deployments
- Active alerts

## Completion Criterion

Errors in production are detected and alerted within minutes. Performance baseline established with dashboards. Health check endpoint live and monitored. AI/ML costs tracked.

## Next Phase

→ `16)Maintenance-Evolution.md`
