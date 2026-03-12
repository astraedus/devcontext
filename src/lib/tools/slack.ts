/**
 * Slack tool definitions for the AI agent.
 *
 * These tools are called by Claude during chat. In production, they use Auth0
 * Token Vault to retrieve Slack OAuth tokens for Slack API access.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";

const unreadMessagesSchema = z.object({
  limit: z
    .number()
    .min(1)
    .max(50)
    .describe("Maximum number of messages to return (default 20)"),
});

const channelSummarySchema = z.object({
  channelName: z
    .string()
    .describe("Channel name (without #, e.g. 'general')"),
  messageCount: z
    .number()
    .min(5)
    .max(50)
    .describe("Number of recent messages to summarize (default 20)"),
});

export const slackTools = {
  getUnreadMessages: tool<z.infer<typeof unreadMessagesSchema>, { status: string; message: string; limit: number }>({
    description:
      "Get unread direct messages and channel mentions from Slack.",
    inputSchema: zodSchema(unreadMessagesSchema),
    execute: async ({ limit }) => {
      return {
        status: "not_connected",
        message: `Slack is not connected yet. Visit /dashboard/permissions to connect it and allow the agent to read your last ${limit} unread messages.`,
        limit,
      };
    },
  }),

  getChannelSummary: tool<z.infer<typeof channelSummarySchema>, { status: string; message: string; channelName: string; messageCount: number }>({
    description:
      "Get a summary of recent activity in a specific Slack channel.",
    inputSchema: zodSchema(channelSummarySchema),
    execute: async ({ channelName, messageCount }) => {
      return {
        status: "not_connected",
        message: `Slack is not connected yet. Visit /dashboard/permissions to connect it and allow the agent to summarize the last ${messageCount} messages in #${channelName}.`,
        channelName,
        messageCount,
      };
    },
  }),
};
