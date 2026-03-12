"use client";

import type { AuditEntry } from "@/lib/types";

const PLACEHOLDER_ENTRIES: AuditEntry[] = [
  {
    id: "placeholder",
    timestamp: "—",
    provider: "—",
    action: "No activity yet. Connect services and chat to see access logs.",
    endpoint: "—",
    status: "success",
  },
];

const statusStyles: Record<AuditEntry["status"], string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  denied: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function AuditLog() {
  const entries = PLACEHOLDER_ENTRIES;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_120px_160px_120px_80px] gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
          Action
        </p>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
          Provider
        </p>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
          Endpoint
        </p>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
          Timestamp
        </p>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
          Status
        </p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.06]">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-[1fr_120px_160px_120px_80px] gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <p className="text-sm text-white/80 truncate">{entry.action}</p>
            <p className="text-sm text-white/50 font-mono">{entry.provider}</p>
            <p className="text-sm text-white/40 font-mono truncate">
              {entry.endpoint}
            </p>
            <p className="text-xs text-white/40">{entry.timestamp}</p>
            <span
              className={`inline-flex items-center self-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                statusStyles[entry.status]
              }`}
            >
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
