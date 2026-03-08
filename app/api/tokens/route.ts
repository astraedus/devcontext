// Token status API — placeholder
// Returns which Auth0 Token Vault tokens are available for the current user

import { NextResponse } from "next/server";

export interface TokenStatus {
  service: string;
  connected: boolean;
  scopes: string[];
  expiresAt?: string;
}

export async function GET() {
  // TODO: Query Auth0 Token Vault for current user's token status
  const tokens: TokenStatus[] = [
    { service: "github", connected: false, scopes: [] },
    { service: "google-calendar", connected: false, scopes: [] },
    { service: "slack", connected: false, scopes: [] },
  ];

  return NextResponse.json({ tokens });
}
