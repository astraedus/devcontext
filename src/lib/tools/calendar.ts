/**
 * Google Calendar tools — uses Auth0 Token Vault for authentication.
 *
 * Each tool attempts to get a Google access token via Token Vault.
 * If the token is unavailable (service not connected), the tool returns
 * a not_connected status with an audit log entry.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";
import { getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { logAudit } from "../audit";
import { checkProviderAccess } from "../permissions";

const listEventsSchema = z.object({
  days: z.number().min(1).max(14).describe("Number of days to look ahead (default 3)"),
});

export const calendarTools = {
  listUpcomingEvents: tool({
    description: "List upcoming calendar events for the authenticated user in the next N days.",
    parameters: zodSchema(listEventsSchema),
    execute: async ({ days }) => {
      try {
        const access = await checkProviderAccess("google-calendar");
        if (!access.allowed) return access.result;

        let token: string;
        try {
          token = getAccessTokenFromTokenVault();
        } catch {
          logAudit("google-calendar", "Token Vault Exchange", "No Google Calendar token available -- service not connected", "error");
          return { status: "not_connected", message: "Google Calendar is not connected. Visit /dashboard/permissions to connect it." };
        }

        const now = new Date();
        const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        const params = new URLSearchParams({
          timeMin: now.toISOString(),
          timeMax: future.toISOString(),
          maxResults: "10",
          singleEvents: "true",
          orderBy: "startTime",
        });

        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return { status: "error", message: `Calendar API error: ${res.status}` };

        const data = await res.json();
        const events = (data.items || []).map((e: any) => ({
          title: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date,
          link: e.htmlLink,
          attendees: e.attendees?.length || 0,
        }));

        logAudit("google-calendar", "List Upcoming Events", `GET /calendar/v3/calendars/primary/events`, "success");
        return { status: "ok", days, count: events.length, events };
      } catch (err) {
        logAudit("google-calendar", "List Upcoming Events", "GET /calendar/v3/calendars/primary/events", "error");
        return { status: "error", message: String(err) };
      }
    },
  }),

  getTodaySchedule: tool({
    description: "Get the complete schedule for today from Google Calendar.",
    parameters: zodSchema(z.object({})),
    execute: async () => {
      try {
        const access = await checkProviderAccess("google-calendar");
        if (!access.allowed) return access.result;

        let token: string;
        try {
          token = getAccessTokenFromTokenVault();
        } catch {
          logAudit("google-calendar", "Token Vault Exchange", "No Google Calendar token available -- service not connected", "error");
          return { status: "not_connected", message: "Google Calendar is not connected. Visit /dashboard/permissions to connect it." };
        }

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const params = new URLSearchParams({
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          maxResults: "20",
          singleEvents: "true",
          orderBy: "startTime",
        });

        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return { status: "error", message: `Calendar API error: ${res.status}` };

        const data = await res.json();
        const events = (data.items || []).map((e: any) => ({
          title: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date,
          location: e.location || null,
          attendeeCount: e.attendees?.length || 0,
        }));

        logAudit("google-calendar", "Get Today's Schedule", "GET /calendar/v3/calendars/primary/events", "success");
        return { status: "ok", date: now.toISOString().split("T")[0], count: events.length, events };
      } catch (err) {
        logAudit("google-calendar", "Get Today's Schedule", "GET /calendar/v3/calendars/primary/events", "error");
        return { status: "error", message: String(err) };
      }
    },
  }),
};
