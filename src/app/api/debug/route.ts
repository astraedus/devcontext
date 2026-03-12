import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth0.getSession();
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email ?? null,
      hasTokenSet: !!session?.tokenSet,
      hasRefreshToken: !!session?.tokenSet?.refreshToken,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    });
  }
}
