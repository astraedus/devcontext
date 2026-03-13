export interface Provider {
  id: "github" | "google-calendar" | "slack";
  name: string;
  connected: boolean;
  revoked: boolean;
  scopes: string[];
  description: string;
  lastUsed: string | null;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  provider: string;
  action: string;
  endpoint: string;
  status: "success" | "denied" | "error";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
