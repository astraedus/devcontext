import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import {
  getPermissionOverrides,
  setProviderRevoked,
} from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = (session.user as Record<string, unknown>).sub as string;
  const overrides = getPermissionOverrides(sub);

  return NextResponse.json({ overrides });
}

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = (session.user as Record<string, unknown>).sub as string;
  const { providerId, action } = await req.json();

  if (!providerId || !["revoke", "grant"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid request. Need providerId and action (revoke|grant)." },
      { status: 400 }
    );
  }

  const revoked = action === "revoke";
  setProviderRevoked(sub, providerId, revoked);

  logAudit(
    providerId,
    revoked ? "Access Revoked" : "Access Re-enabled",
    `User ${revoked ? "revoked" : "re-enabled"} AI access to ${providerId}`,
    revoked ? "denied" : "success"
  );

  return NextResponse.json({
    providerId,
    revoked,
    message: revoked
      ? `AI access to ${providerId} has been revoked.`
      : `AI access to ${providerId} has been re-enabled.`,
  });
}
