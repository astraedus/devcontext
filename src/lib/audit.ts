interface AuditEntry {
  id: string;
  timestamp: string;
  provider: string;
  action: string;
  endpoint: string;
  status: "success" | "denied" | "error";
}

// Use globalThis to share audit log across serverless function invocations
// within the same warm container. Resets on cold start.
// For production, this would use a database.
const globalAudit = globalThis as unknown as { __auditLog?: AuditEntry[] };
if (!globalAudit.__auditLog) {
  globalAudit.__auditLog = [];
}
const auditLog = globalAudit.__auditLog;

export function logAudit(
  provider: string,
  action: string,
  endpoint: string,
  status: "success" | "denied" | "error"
) {
  auditLog.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    provider,
    action,
    endpoint,
    status,
  });

  // Keep last 100 entries
  if (auditLog.length > 100) {
    auditLog.length = 100;
  }
}

export function getAuditEntries(): AuditEntry[] {
  return auditLog;
}
