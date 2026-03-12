import { PermissionCard } from "@/components/PermissionCard";
import { auth0 } from "@/lib/auth0";
import type { Provider } from "@/lib/types";

const PROVIDERS_BASE: Omit<Provider, "connected" | "lastUsed">[] = [
  {
    id: "github",
    name: "GitHub",
    scopes: ["repo", "read:user", "notifications"],
    description: "Access pull requests, commits, and repository notifications.",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    scopes: ["calendar.readonly", "calendar.events.readonly"],
    description: "Read upcoming meetings and scheduling context.",
  },
  {
    id: "slack",
    name: "Slack",
    scopes: ["channels:history", "users:read", "im:history"],
    description: "Read unread messages, channel activity, and mentions.",
  },
];

const CONNECTION_MAP: Record<string, string> = {
  github: "github",
  "google-calendar": "google-oauth2",
  slack: "slack",
};

export default async function PermissionsPage() {
  const session = await auth0.getSession();
  const identities: Array<{ connection?: string; provider?: string }> =
    ((session?.user as Record<string, unknown> | undefined)?.identities as Array<{
      connection?: string;
      provider?: string;
    }>) ?? [];

  const providers: Provider[] = PROVIDERS_BASE.map((p) => {
    const connectionName = CONNECTION_MAP[p.id];
    const isConnected = identities.some(
      (id) => id.connection === connectionName || id.provider === connectionName
    );
    return { ...p, connected: isConnected, lastUsed: null };
  });
  return (
    <>
      <header className="flex h-14 items-center border-b border-white/10 px-6">
        <h1 className="text-sm font-semibold text-white/80">
          Permission Control Center
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <p className="mb-2 text-sm font-medium text-white">
            Connected Services
          </p>
          <p className="mb-8 text-sm text-white/50">
            Manage which services your AI agent can access via Auth0 Token
            Vault. Revoke access at any time without losing your account
            connections.
          </p>

          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {providers.map((provider) => (
              <PermissionCard key={provider.id} provider={provider} />
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium text-white/60 mb-1">
              How Token Vault works
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              Auth0 Token Vault stores your OAuth tokens securely. When the AI
              agent needs to access a service, it requests a token through the
              vault. Tokens are scoped, time-limited, and every access is
              logged. You can revoke access instantly without re-authenticating
              with the provider.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
