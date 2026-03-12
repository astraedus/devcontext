"use client";

import type { Provider } from "@/lib/types";

interface PermissionCardProps {
  provider: Provider;
}

function ProviderIcon({ id }: { id: Provider["id"] }) {
  if (id === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  if (id === "google-calendar") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (id === "slack") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    );
  }
  return null;
}

const providerColors: Record<
  Provider["id"],
  { icon: string; badge: string; border: string; connectBtn: string }
> = {
  github: {
    icon: "text-white",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    border: "border-white/10",
    connectBtn: "bg-white text-black hover:bg-white/90",
  },
  "google-calendar": {
    icon: "text-blue-400",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    border: "border-blue-500/20",
    connectBtn: "bg-blue-600 text-white hover:bg-blue-700",
  },
  slack: {
    icon: "text-purple-400",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    border: "border-purple-500/20",
    connectBtn: "bg-purple-600 text-white hover:bg-purple-700",
  },
};

export function PermissionCard({ provider }: PermissionCardProps) {
  const colors = providerColors[provider.id];

  return (
    <div
      className={`rounded-xl border ${colors.border} bg-white/[0.03] p-5 flex flex-col gap-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`${colors.icon}`}>
            <ProviderIcon id={provider.id} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{provider.name}</p>
            {provider.lastUsed && (
              <p className="text-xs text-white/40">
                Last accessed {provider.lastUsed}
              </p>
            )}
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            provider.connected
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              provider.connected ? "bg-emerald-400" : "bg-white/30"
            }`}
          />
          {provider.connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed">
        {provider.description}
      </p>

      {/* Scopes */}
      {provider.scopes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {provider.scopes.map((scope) => (
            <span
              key={scope}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50"
            >
              {scope}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <button
        className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
          provider.connected
            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            : `${colors.connectBtn} border border-transparent`
        }`}
      >
        {provider.connected ? "Revoke Access" : `Connect ${provider.name}`}
      </button>
    </div>
  );
}
