type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

interface LogPayload {
  message: string;
  requestId?: string;
  userId?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  error?: unknown;
}

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return (
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.includes("password") ||
    lower.includes("authorization") ||
    lower.includes("cookie") ||
    lower.includes("apikey") ||
    lower.includes("api_key") ||
    lower.includes("access_key") ||
    lower.includes("accesskey") ||
    lower.includes("private")
  );
}

function redactSensitiveData(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      sanitized[key] = "<REDACTED>";
    } else if (typeof val === "object" && val !== null) {
      sanitized[key] = redactSensitiveData(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

function writeLog(level: LogLevel, payload: LogPayload) {
  const logEntry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message: payload.message,
  };

  if (payload.requestId) logEntry.requestId = payload.requestId;
  if (payload.userId) logEntry.userId = payload.userId;
  if (payload.durationMs !== undefined) logEntry.durationMs = payload.durationMs;
  if (payload.metadata) logEntry.metadata = redactSensitiveData(payload.metadata);
  if (payload.error !== undefined) {
    logEntry.error =
      payload.error instanceof Error
        ? {
            name: payload.error.name,
            message: payload.error.message,
            stack: process.env.NODE_ENV !== "production" ? payload.error.stack : undefined,
          }
        : payload.error;
  }

  const output = JSON.stringify(logEntry);

  switch (level) {
    case "ERROR":
      console.error(output);
      break;
    case "WARN":
      console.warn(output);
      break;
    case "INFO":
      console.info(output);
      break;
    case "DEBUG":
      if (process.env.NODE_ENV !== "production") {
        console.debug(output);
      }
      break;
  }
}

export const logger = {
  info: (message: string, meta?: Omit<LogPayload, "message">) =>
    writeLog("INFO", { message, ...meta }),
  warn: (message: string, meta?: Omit<LogPayload, "message">) =>
    writeLog("WARN", { message, ...meta }),
  error: (message: string, meta?: Omit<LogPayload, "message">) =>
    writeLog("ERROR", { message, ...meta }),
  debug: (message: string, meta?: Omit<LogPayload, "message">) =>
    writeLog("DEBUG", { message, ...meta }),
};
