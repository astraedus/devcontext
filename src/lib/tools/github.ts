/**
 * GitHub tool definitions for the AI agent.
 *
 * These tools are called by Claude during chat. In production, they use Auth0
 * Token Vault to retrieve GitHub OAuth tokens. Token exchange happens
 * server-side via /api/tokens/github — tokens never reach the client.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";

const listPRsSchema = z.object({
  filter: z
    .enum(["created", "assigned", "review-requested"])
    .describe("Which PRs to list: created by me, assigned to me, or review-requested from me"),
});

const getCommitsSchema = z.object({
  repo: z.string().describe("Repository in owner/repo format").optional(),
});

type PRResult = { status: string; message: string; filter: string };
type CommitResult = { status: string; message: string; repo: string | null };
type NotifResult = { status: string; message: string };

export const githubTools = {
  listPullRequests: tool<z.infer<typeof listPRsSchema>, PRResult>({
    description:
      "List open pull requests authored by or assigned to the authenticated GitHub user across all repositories.",
    inputSchema: zodSchema(listPRsSchema),
    execute: async ({ filter }) => {
      return {
        status: "not_connected",
        message: `GitHub is not connected yet. Visit /dashboard/permissions to connect GitHub and allow the agent to list your ${filter} pull requests.`,
        filter,
      };
    },
  }),

  getRecentCommits: tool<z.infer<typeof getCommitsSchema>, CommitResult>({
    description:
      "Get recent commits by the authenticated GitHub user in the last 7 days.",
    inputSchema: zodSchema(getCommitsSchema),
    execute: async ({ repo }) => {
      return {
        status: "not_connected",
        message: `GitHub is not connected yet. Visit /dashboard/permissions to connect GitHub${repo ? ` and allow access to ${repo}` : ""}.`,
        repo: repo ?? null,
      };
    },
  }),

  getNotifications: tool<Record<string, never>, NotifResult>({
    description:
      "Get unread GitHub notifications (mentions, review requests, assignments).",
    inputSchema: zodSchema(z.object({})),
    execute: async () => {
      return {
        status: "not_connected",
        message:
          "GitHub is not connected yet. Visit /dashboard/permissions to connect GitHub and allow the agent to read your notifications.",
      };
    },
  }),
};
