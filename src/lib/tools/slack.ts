/**
 * Slack tools — uses Auth0 Token Vault for authentication.
 *
 * Each tool is wrapped with `withSlackConnection` which automatically
 * exchanges the user's Auth0 refresh token for a Slack access token
 * via Token Vault before execution.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";
import { getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { withSlackConnection } from "../auth0-ai";
import { logAudit } from "../audit";

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
  getUnreadMessages: withSlackConnection(
    tool({
      description:
        "Get unread direct messages and channel mentions from Slack.",
      parameters: zodSchema(unreadMessagesSchema),
      execute: async ({ limit }) => {
        try {
          const credentials = getAccessTokenFromTokenVault();
          const token = credentials?.accessToken;
          if (!token) {
            return {
              status: "not_connected",
              message:
                "Slack is not connected. Visit /dashboard/permissions to connect it.",
            };
          }

          // Get conversations list
          const res = await fetch(
            `https://slack.com/api/conversations.list?types=im,mpim&limit=${limit}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!res.ok) {
            return { status: "error", message: `Slack API error: ${res.status}` };
          }

          const data = await res.json();
          if (!data.ok) {
            return { status: "error", message: `Slack error: ${data.error}` };
          }

          const channels = data.channels || [];
          const unread = channels
            .filter((c: { is_im: boolean; unread_count?: number }) => c.is_im && (c.unread_count || 0) > 0)
            .slice(0, limit)
            .map((c: { user: string; unread_count: number }) => ({
              user: c.user,
              unreadCount: c.unread_count,
            }));

          logAudit("slack", "Get Unread Messages", "GET /conversations.list", "success");
          return { status: "ok", count: unread.length, conversations: unread };
        } catch (err) {
          logAudit("slack", "Get Unread Messages", "GET /conversations.list", "error");
          return { status: "error", message: String(err) };
        }
      },
    })
  ),

  getChannelSummary: withSlackConnection(
    tool({
      description:
        "Get a summary of recent activity in a specific Slack channel.",
      parameters: zodSchema(channelSummarySchema),
      execute: async ({ channelName, messageCount }) => {
        try {
          const credentials = getAccessTokenFromTokenVault();
          const token = credentials?.accessToken;
          if (!token) {
            return {
              status: "not_connected",
              message:
                "Slack is not connected. Visit /dashboard/permissions to connect it.",
            };
          }

          // Find channel by name
          const listRes = await fetch(
            "https://slack.com/api/conversations.list?types=public_channel&limit=200",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const listData = await listRes.json();
          if (!listData.ok) {
            return { status: "error", message: `Slack error: ${listData.error}` };
          }

          const channel = (listData.channels || []).find(
            (c: { name: string }) => c.name === channelName
          );

          if (!channel) {
            return {
              status: "error",
              message: `Channel #${channelName} not found. Available channels: ${(listData.channels || [])
                .slice(0, 5)
                .map((c: { name: string }) => c.name)
                .join(", ")}`,
            };
          }

          // Get messages
          const historyRes = await fetch(
            `https://slack.com/api/conversations.history?channel=${channel.id}&limit=${messageCount}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const historyData = await historyRes.json();
          if (!historyData.ok) {
            return { status: "error", message: `Slack error: ${historyData.error}` };
          }

          const messages = (historyData.messages || []).map(
            (m: { text: string; user: string; ts: string }) => ({
              text: m.text.slice(0, 200),
              user: m.user,
              timestamp: new Date(parseFloat(m.ts) * 1000).toISOString(),
            })
          );

          logAudit("slack", "Get Channel Summary", `GET /conversations.history?channel=${channelName}`, "success");
          return {
            status: "ok",
            channel: channelName,
            count: messages.length,
            messages,
          };
        } catch (err) {
          logAudit("slack", "Get Channel Summary", "GET /conversations.history", "error");
          return { status: "error", message: String(err) };
        }
      },
    })
  ),
};
