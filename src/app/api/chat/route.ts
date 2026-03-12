import { streamText, stepCountIs, tool, zodSchema } from "ai";
import { z } from "zod";
import { setAIContext } from "@auth0/ai-vercel";
import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { githubTools } from "@/lib/tools/github";
import { calendarTools } from "@/lib/tools/calendar";
import { slackTools } from "@/lib/tools/slack";

const SYSTEM_PROMPT = `You are DevContext, an AI developer assistant with access to the user's GitHub, Google Calendar, and Slack via Auth0 Token Vault.

CRITICAL RULE: You MUST call tools before responding to ANY question about work, PRs, meetings, messages, schedule, or developer context. Never generate a text response about these topics without first calling the relevant tool(s). The tools handle their own error states — always invoke them.

For a "morning briefing" or similar request, you MUST call ALL THREE: listPullRequests (or getRecentCommits), getTodaySchedule (or listUpcomingEvents), AND getUnreadMessages. Call them, get results, then summarize.

Your role is to provide concise, actionable developer briefings. Use your tools to fetch:
- Open pull requests and review assignments from GitHub (listPullRequests, getRecentCommits, getNotifications)
- Upcoming meetings from Google Calendar (listUpcomingEvents, getTodaySchedule)
- Unread messages and mentions from Slack (getUnreadMessages, getChannelSummary)

Always lead with the most important items. Be brief and developer-friendly. Format lists with bullet points.
If a tool returns status "not_connected", tell the user to visit the Permissions page to connect that service.`;

function getModel() {
  // Use Anthropic if available, fall back to Google Gemini
  if (process.env.ANTHROPIC_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { anthropic } = require("@ai-sdk/anthropic");
    return anthropic("claude-sonnet-4-5");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { google } = require("@ai-sdk/google");
  return google("gemini-2.5-flash");
}

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();

  // Set AI context for Token Vault — required for AsyncLocalStorage-based credential passing
  const userSub = (session.user as Record<string, unknown>).sub as string;
  setAIContext({ threadID: userSub });

  const allTools = {
    ...githubTools,
    ...calendarTools,
    ...slackTools,
    getServerTime: tool({
      description: "Get the current server time. Call this when the user asks about time or as a connectivity test.",
      parameters: zodSchema(z.object({})),
      execute: async () => {
        return { time: new Date().toISOString(), status: "ok" };
      },
    }),
  };

  console.log("[DevContext] Tool names:", Object.keys(allTools));
  console.log("[DevContext] Tool types:", Object.entries(allTools).map(([k, v]) => `${k}: ${typeof v}`));

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages,
    tools: allTools,
    maxSteps: 5,
    stopWhen: stepCountIs(5),
  });

  return result.toTextStreamResponse();
}
