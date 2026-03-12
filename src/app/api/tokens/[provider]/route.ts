import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { exchangeToken } from "@/lib/token-vault";

const SUPPORTED_PROVIDERS = ["github", "google-calendar", "slack"] as const;
type Provider = (typeof SUPPORTED_PROVIDERS)[number];

function isProvider(value: string): value is Provider {
  return SUPPORTED_PROVIDERS.includes(value as Provider);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await params;

  if (!isProvider(provider)) {
    return NextResponse.json(
      { error: `Unsupported provider: ${provider}` },
      { status: 400 }
    );
  }

  const token = await exchangeToken(session.user.sub as string, provider);

  if (!token) {
    return NextResponse.json(
      { error: `No token available for provider: ${provider}. Connect it in Permissions.` },
      { status: 404 }
    );
  }

  // Never expose the raw token to the client — this endpoint is server-side only.
  // Return only metadata.
  return NextResponse.json({
    provider,
    available: true,
    expiresAt: token.expiresAt,
  });
}
