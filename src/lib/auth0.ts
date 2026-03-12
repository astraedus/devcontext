/**
 * Auth0 SDK client for @auth0/nextjs-auth0 v4.
 *
 * This client is used server-side for session management, middleware,
 * and token operations. It reads AUTH0_* environment variables automatically.
 *
 * Required environment variables (see .env.local.example):
 *   AUTH0_SECRET          - 32-byte random secret for session encryption
 *   AUTH0_BASE_URL        - Your app's base URL (http://localhost:3000 in dev)
 *   AUTH0_ISSUER_BASE_URL - Your Auth0 domain (https://your-tenant.auth0.com)
 *   AUTH0_CLIENT_ID       - Auth0 application client ID
 *   AUTH0_CLIENT_SECRET   - Auth0 application client secret
 *
 * Social connections (GitHub, Google, Slack) are configured in your
 * Auth0 tenant's Social Connections settings. Token Vault is enabled per
 * connection in the Auth0 dashboard.
 *
 * Auth routes are handled by the middleware at src/middleware.ts:
 *   /auth/login     - Redirects to Auth0 login
 *   /auth/logout    - Clears session and redirects
 *   /auth/callback  - Processes Auth0 callback
 */

import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();
