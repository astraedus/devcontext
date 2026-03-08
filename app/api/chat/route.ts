// Chat API route — placeholder
// Will use Vercel AI SDK with Claude to stream responses
// Auth0 Token Vault will inject context from connected services

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: Implement streaming chat with Vercel AI SDK
  // const { messages } = await req.json();
  // const result = streamText({ model: anthropic("claude-opus-4-5"), messages });
  // return result.toDataStreamResponse();

  return NextResponse.json(
    { message: "Chat API not yet implemented" },
    { status: 501 }
  );
}
