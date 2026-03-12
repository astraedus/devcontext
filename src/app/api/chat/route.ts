import { streamText, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { githubTools } from "@/lib/tools/github";
import { calendarTools } from "@/lib/tools/calendar";
import { slackTools } from "@/lib/tools/slack";

const SYSTEM_PROMPT = `You are DevContext, an AI developer assistant with access to the user's GitHub, Google Calendar, and Slack.

Your role is to provide concise, actionable developer briefings. When asked about current context, proactively use your tools to fetch:
- Open pull requests and review assignments from GitHub
- Upcoming meetings from Google Calendar
- Unread messages and mentions from Slack

Always lead with the most important items. Be brief and developer-friendly. Format lists with bullet points.
If a service is not connected, mention it and suggest the user visit the Permissions page to connect it.`;

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-opus-4-5"),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      ...githubTools,
      ...calendarTools,
      ...slackTools,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toTextStreamResponse();
}
