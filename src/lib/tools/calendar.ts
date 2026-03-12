/**
 * Google Calendar tool definitions for the AI agent.
 *
 * These tools are called by Claude during chat. In production, they use Auth0
 * Token Vault to retrieve Google OAuth tokens for Calendar API access.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";

const listUpcomingEventsSchema = z.object({
  days: z.number().describe("Number of days to look ahead (1-14, default 3)"),
  maxResults: z.number().describe("Maximum number of events to return (1-20, default 10)"),
});

export const calendarTools = {
  listUpcomingEvents: tool<z.infer<typeof listUpcomingEventsSchema>, { status: string; message: string; days: number; maxResults: number }>({
    description:
      "List upcoming calendar events for the authenticated user in the next N days.",
    inputSchema: zodSchema(listUpcomingEventsSchema),
    execute: async ({ days, maxResults }) => {
      return {
        status: "not_connected",
        message: `Google Calendar is not connected yet. Visit /dashboard/permissions to connect it and allow the agent to list your next ${days} days of events (up to ${maxResults} results).`,
        days,
        maxResults,
      };
    },
  }),

  getTodaySchedule: tool<Record<string, never>, { status: string; message: string }>({
    description:
      "Get the complete schedule for today from Google Calendar, organized by time.",
    inputSchema: zodSchema(z.object({})),
    execute: async () => {
      return {
        status: "not_connected",
        message:
          "Google Calendar is not connected yet. Visit /dashboard/permissions to connect it and allow the agent to read your daily schedule.",
      };
    },
  }),
};
