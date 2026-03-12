/**
 * Auth0 AI + Token Vault integration.
 *
 * Uses @auth0/ai-vercel to wrap tool calls with automatic token exchange.
 * When a tool needs to call GitHub/Google/Slack APIs, the wrapper exchanges
 * the user's Auth0 refresh token for a fresh provider access token via
 * Auth0's Token Vault (RFC 8693 token exchange).
 */

import { Auth0AI } from "@auth0/ai-vercel";
import { auth0 } from "./auth0";

const auth0AI = new Auth0AI();

/** Wraps a tool to inject a GitHub access token via Token Vault. */
export const withGitHubConnection = auth0AI.withTokenVault({
  connection: "github",
  scopes: ["repo", "read:user", "notifications"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet?.refreshToken;
  },
});

/** Wraps a tool to inject a Google access token via Token Vault. */
export const withGoogleConnection = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet?.refreshToken;
  },
});

/** Wraps a tool to inject a Slack access token via Token Vault. */
export const withSlackConnection = auth0AI.withTokenVault({
  connection: "slack",
  scopes: ["channels:history", "users:read", "im:history"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet?.refreshToken;
  },
});
