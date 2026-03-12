interface AuditEntry {
  id: string;
  timestamp: string;
  provider: string;
  action: string;
  endpoint: string;
  status: "success" | "denied" | "error";
}

// In-memory audit log (resets on serverless cold start)
// For production, this would use a database
const auditLog: AuditEntry[] = [];

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
