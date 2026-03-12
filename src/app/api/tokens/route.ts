import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getTokenStatuses } from "@/lib/token-vault";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await getTokenStatuses(session.user.sub as string);
  return NextResponse.json({ tokens });
}
