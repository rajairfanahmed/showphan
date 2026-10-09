# Showphan Phase 15: Monitoring & Observability Architecture

**System:** Showphan Production System (`https://showphan.vercel.app`)  
**Status:** Active & Implemented  
**Environment:** Production (Vercel Serverless / Edge + Neon Serverless PostgreSQL + Cloudflare R2)

---

## 1. Application Logging Architecture

Showphan enforces structured JSON logging across all backend server routes, middleware/proxies, and background services via [`src/lib/logger.ts`](file:///d:/Showphan/src/lib/logger.ts).

### Log Schema Format
Every log message emitted in production uses standard structured JSON:

```json
{
  "timestamp": "2026-10-09T09:20:00.123Z",
  "level": "INFO",
  "message": "Project publication completed",
  "requestId": "a50c822e-1317-4ef8-a28a-7e1e6955a5bf",
  "userId": "usr_948f2",
  "durationMs": 42,
  "metadata": {
    "projectId": "clx...",
    "slug": "realtime-chat-engine"
  }
}
```

### Log Levels
| Level | Severity | Usage & Triggers | Retention |
| :--- | :--- | :--- | :--- |
| **`ERROR`** | High | System faults, unhandled exceptions, database query failures, R2 presigning failures. Emitted to `stderr`. | 30 days |
| **`WARN`** | Medium | Quality gate rejections, rate limits, non-critical R2 file cleanup failures, deprecated routes. Emitted to `stdout`. | 14 days |
| **`INFO`** | Normal | Lifecycle milestones (successful OAuth login, project published, profile updated). Emitted to `stdout`. | 7 days |
| **`DEBUG`** | Low | Development traces, raw payloads. Filtered out in production (`NODE_ENV === "production"`). | Development only |

### PII & Sensitive Data Redaction
To strictly satisfy privacy compliance, the logging engine scans all object keys and nested attributes against security matchers (`secret`, `token`, `password`, `authorization`, `cookie`, `apikey`, `accesskey`, `private`). Sensitive strings are automatically sanitized with the `<REDACTED>` placeholder prior to emission.

---

## 2. Distributed Tracing & Request IDs

### Next.js 16 Proxy Layer
In accordance with Next.js 16 conventions, [`src/proxy.ts`](file:///d:/Showphan/src/proxy.ts) executes prior to route execution:
1. Detects or generates an immutable `x-request-id` (UUID v4).
2. Attaches `x-request-id` to downstream request headers for API route handlers and server components.
3. Echoes `x-request-id` in response headers to allow end-to-end client correlation during troubleshooting.

---

## 3. Error Tracking & Crash Resilience

### 1. Global & Layout Error Boundaries
- **App Error Boundary ([`src/app/error.tsx`](file:///d:/Showphan/src/app/error.tsx)):** Catches unhandled exceptions during client or server rendering in page routes, captures the Next.js `digest` code, displays a styled recovery UI adhering to Showphan's dark theme tokens, and provides an interactive retry mechanism.
- **Root Layout Error Boundary ([`src/app/global-error.tsx`](file:///d:/Showphan/src/app/global-error.tsx)):** Catches fatal layout rendering crashes, preserves the error digest code, and allows full application reset.

### 2. Error Aggregation & Grouping
- Errors are captured in Vercel Function logs and indexed with their `digest` identifier.
- Server-side errors serialize error type (`name`), user-friendly message (`message`), and request correlation ID (`requestId`), with stack traces withheld in production to avoid leaking internal implementation details.

---

## 4. Health Probes & Dependency SLA

Showphan exposes two monitoring endpoints configured with direct route handlers and root rewrites:

### 1. Liveness & Health Probe: `GET /health` (or `GET /api/health`)
- **HTTP 200 OK:** System is online and healthy.
- **HTTP 503 Service Unavailable:** Database query failed or primary credentials are missing.
- **Payload:**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-09T09:21:00.000Z",
  "version": "1.0.0",
  "uptimeSeconds": 1420,
  "totalLatencyMs": 14,
  "checks": {
    "database": {
      "status": "connected",
      "latencyMs": 12
    },
    "storage": {
      "status": "configured",
      "provider": "Cloudflare R2"
    }
  }
}
```

### 2. Readiness Probe: `GET /ready` (or `GET /api/ready`)
- **HTTP 200 OK:** Can serve traffic (Neon PostgreSQL database ping `SELECT 1` successful).
- **HTTP 503 Service Unavailable:** Database is unreachable or pool is exhausted.

---

## 5. Performance Metrics & Baselines

| Metric | Target Baseline | SLA / Warning Threshold | Critical Incident Threshold |
| :--- | :--- | :--- | :--- |
| **API Latency (p50)** | < 80 ms | > 200 ms | > 500 ms |
| **API Latency (p95)** | < 180 ms | > 400 ms | > 1000 ms |
| **API Latency (p99)** | < 350 ms | > 800 ms | > 2000 ms |
| **HTTP 5xx Error Rate** | < 0.05% | > 1.0% | > 2.0% (for 5 minutes) |
| **Database Query Time** | < 25 ms | > 100 ms (slow query flag) | > 500 ms |
| **Client Core Web Vitals (LCP)** | < 1.2 s | > 2.5 s | > 4.0 s |
| **Client Core Web Vitals (CLS)** | < 0.02 | > 0.1 | > 0.25 |
| **Client Core Web Vitals (INP)** | < 50 ms | > 200 ms | > 500 ms |

---

## 6. Incident Alerting Rules

| Incident Type | Trigger Condition | Notification Channel | Remediation Action |
| :--- | :--- | :--- | :--- |
| **Health Check Failure** | 3 consecutive non-200 responses from `/health` (60s check interval) | Slack `#ops-alerts` + Email | Verify Neon DB connection pool, check Vercel status, check credentials |
| **Error Rate Spike** | 5xx error rate exceeds 2x baseline (>2%) for 5 consecutive minutes | Slack `#ops-critical` + PagerDuty | Inspect Vercel runtime logs for top error signatures; trigger rollback if deployment-related |
| **Latency Degradation** | API p95 latency exceeds 500ms for 5 consecutive minutes | Slack `#ops-alerts` | Inspect database slow queries (`pg_stat_statements`) and R2 network latencies |
| **Storage Anomaly** | Presigned URL generation error rate > 5% | Slack `#ops-alerts` | Verify Cloudflare R2 bucket access permissions and token expiration |

---

## 7. AI/ML Observability (Future Roadmap)

- **v1.0.0 Status:** Showphan v1.0.0 is a deterministic developer showcase and portfolio builder without generative AI inference.
- **v1.1.0 Roadmap Provisioning:**
  - AI bio enhancement and automated project summary generation are scheduled for v1.1.0.
  - At release, token usage budgets, prompt latency (p95 < 2000ms), and drift detection will be integrated using LLM observability tracing (e.g., OpenTelemetry / Langfuse).

---

## 8. Central Observability Dashboard

Production metrics are unified across:
1. **Vercel Analytics & Speed Insights:** Real-user Core Web Vitals, visitor geography, route latency breakdown.
2. **Neon Console:** PostgreSQL connection pool saturation, compute unit scaling, active queries.
3. **Uptime Monitoring:** External probe pinging `https://showphan.vercel.app/health` every 60 seconds with SSL certificate verification.
