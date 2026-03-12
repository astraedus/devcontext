"use client";

import { useState, useEffect } from "react";

interface AuditEntry {
  id: string;
  timestamp: string;
  provider: string;
  action: string;
  endpoint: string;
  status: "success" | "denied" | "error";
}

const statusStyles = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  denied: "bg-red-500/10 text-red-400 border-red-500/20",
  error: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const providerIcons: Record<string, string> = {
  github: "GH",
  "google-calendar": "GC",
  slack: "SL",
};

export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-white/30">
        Loading audit trail...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <div className="text-white/20 mb-2">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 mx-auto fill-none stroke-current stroke-2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <p className="text-sm text-white/40 mb-1">No activity yet</p>
        <p className="text-xs text-white/25">
          Token exchanges will appear here when the AI agent accesses your
          connected services. Try asking a question in the Chat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-[10px] font-bold text-white/40 shrink-0">
            {providerIcons[entry.provider] ?? "??"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/80 truncate">
                {entry.action}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${statusStyles[entry.status]}`}
              >
                {entry.status}
              </span>
            </div>
            <p className="text-[10px] text-white/30 font-mono truncate">
              {entry.endpoint}
            </p>
          </div>

          <time className="text-[10px] text-white/25 shrink-0 tabular-nums">
            {new Date(entry.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </time>
        </div>
      ))}
    </div>
  );
}
