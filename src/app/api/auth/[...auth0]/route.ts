import { NextResponse } from "next/server";

// Auth0 v4 handles auth routes automatically via middleware
// This is a placeholder until Auth0 is configured
export async function GET() {
  return NextResponse.json({ message: "Auth0 not configured yet. Set AUTH0_* env vars." }, { status: 501 });
}
