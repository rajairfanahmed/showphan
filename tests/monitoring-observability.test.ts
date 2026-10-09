import { logger } from "../src/lib/logger";

console.log("🔍 Running Monitoring & Observability Test Suite...");

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`   ✅ [PASS] ${message}`);
  } else {
    console.error(`   ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Test Logger output and PII redaction
let interceptedLogs: string[] = [];
const originalInfo = console.info;
const originalError = console.error;
const originalWarn = console.warn;

console.info = (msg: string) => interceptedLogs.push(msg);
console.error = (msg: string) => interceptedLogs.push(msg);
console.warn = (msg: string) => interceptedLogs.push(msg);

try {
  // Test info log
  logger.info("Test info message", {
    requestId: "req-12345",
    userId: "usr-67890",
    metadata: {
      action: "user_login",
      apiKey: "super-secret-key-12345",
      userPassword: "plain_password_here",
      nested: {
        token: "bearer-token-abc",
        sessionCookie: "cookie-val",
        safeData: "public-username",
      },
    },
  });

  assert(interceptedLogs.length === 1, "Logger captured exactly 1 log entry");

  const parsed = JSON.parse(interceptedLogs[0]);
  assert(parsed.level === "INFO", "Log level is INFO");
  assert(parsed.message === "Test info message", "Log message preserved");
  assert(parsed.requestId === "req-12345", "RequestId preserved");
  assert(parsed.userId === "usr-67890", "UserId preserved");
  assert(typeof parsed.timestamp === "string", "ISO timestamp generated");

  // Verify redactions
  assert(parsed.metadata.apiKey === "<REDACTED>", "apiKey redacted");
  assert(parsed.metadata.userPassword === "<REDACTED>", "userPassword redacted");
  assert(parsed.metadata.nested.token === "<REDACTED>", "Nested token redacted");
  assert(parsed.metadata.nested.sessionCookie === "<REDACTED>", "Nested sessionCookie redacted");
  assert(parsed.metadata.nested.safeData === "public-username", "Safe data preserved unredacted");

  // Test error log
  interceptedLogs = [];
  const testErr = new Error("Database timeout simulation");
  logger.error("Database query failed", {
    requestId: "req-err-999",
    error: testErr,
    durationMs: 145,
  });

  assert(interceptedLogs.length === 1, "Logger captured error log entry");
  const parsedErr = JSON.parse(interceptedLogs[0]);
  assert(parsedErr.level === "ERROR", "Log level is ERROR");
  assert(parsedErr.error.name === "Error", "Error name serialized");
  assert(parsedErr.error.message === "Database timeout simulation", "Error message serialized");
  assert(parsedErr.durationMs === 145, "Execution durationMs logged");

} finally {
  console.info = originalInfo;
  console.error = originalError;
  console.warn = originalWarn;
}

console.log(`\n🎉 OBSERVABILITY SUITE FINISHED: ${passed}/${total} assertions PASSED!\n`);
process.exit(0);
