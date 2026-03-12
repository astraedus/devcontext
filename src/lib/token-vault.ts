/**
 * Auth0 Token Vault helper functions.
 *
 * Token Vault is an Auth0 feature that securely stores and manages OAuth
 * tokens for connected third-party services. The agent calls `exchangeToken`
 * to get a live access token for a given provider — Auth0 handles refresh,
 * expiry, and storage automatically.
 *
 * Docs: https://auth0.com/docs/secure/tokens/token-vault
 */

export interface TokenStatus {
  service: string;
  connected: boolean;
  scopes: string[];
  expiresAt?: string;
}

export interface VaultToken {
  accessToken: string;
  expiresAt: string;
  scopes: string[];
}

/**
 * Retrieve the status of all connected provider tokens for a user.
 * In production, this calls the Auth0 Management API or Token Vault API
 * to check which connections have valid tokens.
 */
export async function getTokenStatuses(userId: string): Promise<TokenStatus[]> {
  const domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  // If not configured, return disconnected placeholders
  if (!domain || !clientId || !clientSecret) {
    return [
      { service: "github", connected: false, scopes: [] },
      { service: "google-calendar", connected: false, scopes: [] },
      { service: "slack", connected: false, scopes: [] },
    ];
  }

  // In production: query Auth0 Management API for user's linked identities
  // and Token Vault for token availability per connection.
  // For now, returns disconnected state until Token Vault is configured.
  console.log(`[token-vault] getTokenStatuses called for user ${userId}`);

  return [
    { service: "github", connected: false, scopes: ["repo", "read:user"] },
    {
      service: "google-calendar",
      connected: false,
      scopes: ["calendar.readonly"],
    },
    {
      service: "slack",
      connected: false,
      scopes: ["channels:history", "users:read"],
    },
  ];
}

/**
 * Exchange for a live access token for a given provider via Auth0 Token Vault.
 * Returns null if the user has not connected this provider.
 *
 * Auth0 Token Vault endpoint: POST /oauth/token with grant_type=urn:ietf:params:oauth:grant-type:token-exchange
 */
export async function exchangeToken(
  userId: string,
  provider: "github" | "google-calendar" | "slack"
): Promise<VaultToken | null> {
  const domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    console.warn(
      "[token-vault] Auth0 not configured — returning null token for",
      provider
    );
    return null;
  }

  try {
    // Token Vault exchange: trade the user's Auth0 session for a provider token
    const response = await fetch(`${domain}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type:
          "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
        client_id: clientId,
        client_secret: clientSecret,
        audience: providerAudience(provider),
        subject: userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.warn("[token-vault] Token exchange failed for", provider, error);
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresAt: new Date(
        Date.now() + (data.expires_in ?? 3600) * 1000
      ).toISOString(),
      scopes: (data.scope ?? "").split(" ").filter(Boolean),
    };
  } catch (err) {
    console.error("[token-vault] exchangeToken error:", err);
    return null;
  }
}

function providerAudience(
  provider: "github" | "google-calendar" | "slack"
): string {
  const audiences: Record<string, string> = {
    github: "https://api.github.com",
    "google-calendar": "https://www.googleapis.com/calendar/v3",
    slack: "https://slack.com/api",
  };
  return audiences[provider] ?? provider;
}
