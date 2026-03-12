import { auth0 } from "./auth0";

interface TokenStatus {
  provider: string;
  connected: boolean;
  lastUsed: string | null;
}

const PROVIDER_MAP: Record<string, string> = {
  github: "github",
  "google-calendar": "google-oauth2",
  slack: "slack",
};

export async function getTokenStatuses(
  _userId: string
): Promise<TokenStatus[]> {
  const session = await auth0.getSession();
  if (!session?.user) return [];

  const identities: Array<{ connection?: string; provider?: string }> =
    ((session.user as Record<string, unknown>).identities as Array<{
      connection?: string;
      provider?: string;
    }>) ?? [];

  return Object.entries(PROVIDER_MAP).map(([providerId, connectionName]) => {
    const isConnected = identities.some(
      (id) =>
        id.connection === connectionName || id.provider === connectionName
    );
    return {
      provider: providerId,
      connected: isConnected,
      lastUsed: null,
    };
  });
}
