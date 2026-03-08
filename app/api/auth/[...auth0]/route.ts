// Auth0 callback routes — placeholder
// Handles /api/auth/login, /api/auth/logout, /api/auth/callback, /api/auth/me

// TODO: Uncomment when Auth0 credentials are configured
// import { handleAuth } from "@auth0/nextjs-auth0";
// export const GET = handleAuth();

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Auth0 routes not yet configured. Set up .env.local first." },
    { status: 501 }
  );
}
