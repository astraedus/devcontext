import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth0.getSession();
    const user = session?.user as Record<string, unknown> | undefined;
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: user?.email ?? null,
      userSub: user?.sub ?? null,
      identities: user?.identities ?? null,
      hasTokenSet: !!session?.tokenSet,
      hasRefreshToken: !!session?.tokenSet?.refreshToken,
      tokenSetKeys: session?.tokenSet ? Object.keys(session.tokenSet) : null,
      userKeys: user ? Object.keys(user) : null,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    });
  }
}
