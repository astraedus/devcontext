/**
 * GitHub tools — uses Auth0 Token Vault for authentication.
 *
 * Each tool is wrapped with `withGitHubConnection` which automatically
 * exchanges the user's Auth0 refresh token for a GitHub access token
 * via Token Vault before execution.
 */

import { tool, zodSchema } from "ai";
import { z } from "zod";
import { getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { withGitHubConnection } from "../auth0-ai";
import { logAudit } from "../audit";

const listPRsSchema = z.object({
  filter: z
    .enum(["created", "assigned", "review-requested"])
    .describe("Which PRs to list: created by me, assigned to me, or review-requested"),
});

const getCommitsSchema = z.object({
  repo: z.string().describe("Repository in owner/repo format").optional(),
});

export const githubTools = {
  listPullRequests: withGitHubConnection(
    tool({
      description:
        "List open pull requests authored by or assigned to the authenticated GitHub user.",
      parameters: zodSchema(listPRsSchema),
      execute: async ({ filter }) => {
        try {
          const credentials = getAccessTokenFromTokenVault();
          const token = credentials?.accessToken;
          if (!token) {
            return {
              status: "not_connected",
              message: "GitHub is not connected. Visit /dashboard/permissions to connect it.",
            };
          }

          const res = await fetch(
            `https://api.github.com/issues?filter=${filter}&state=open&pulls=true`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!res.ok) {
            return { status: "error", message: `GitHub API error: ${res.status}` };
          }

          const issues = await res.json();
          const prs = issues
            .filter((i: { pull_request?: unknown }) => i.pull_request)
            .slice(0, 10)
            .map((pr: { title: string; html_url: string; number: number; repository_url: string; created_at: string; user: { login: string } }) => ({
              title: pr.title,
              url: pr.html_url,
              number: pr.number,
              repo: pr.repository_url.split("/").slice(-2).join("/"),
              created: pr.created_at,
              author: pr.user.login,
            }));

          logAudit("github", "List Pull Requests", `GET /issues?filter=${filter}`, "success");
          return { status: "ok", count: prs.length, pullRequests: prs };
        } catch (err) {
          logAudit("github", "List Pull Requests", "GET /issues", "error");
          return { status: "error", message: String(err) };
        }
      },
    })
  ),

  getRecentCommits: withGitHubConnection(
    tool({
      description:
        "Get recent commits by the authenticated GitHub user in the last 7 days.",
      parameters: zodSchema(getCommitsSchema),
      execute: async ({ repo }) => {
        try {
          const credentials = getAccessTokenFromTokenVault();
          const token = credentials?.accessToken;
          if (!token) {
            return {
              status: "not_connected",
              message: "GitHub is not connected. Visit /dashboard/permissions to connect it.",
            };
          }

          const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

          if (repo) {
            const res = await fetch(
              `https://api.github.com/repos/${repo}/commits?since=${since}&per_page=10`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            if (!res.ok) {
              return { status: "error", message: `GitHub API error: ${res.status}` };
            }

            const commits = await res.json();
            logAudit("github", "Get Recent Commits", `GET /repos/${repo}/commits`, "success");
            return {
              status: "ok",
              repo,
              count: commits.length,
              commits: commits.slice(0, 10).map((c: { sha: string; commit: { message: string; author: { date: string } }; html_url: string }) => ({
                sha: c.sha.slice(0, 7),
                message: c.commit.message.split("\n")[0],
                date: c.commit.author.date,
                url: c.html_url,
              })),
            };
          }

          // No repo specified — get events for the user
          const res = await fetch(
            `https://api.github.com/events?per_page=30`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!res.ok) {
            return { status: "error", message: `GitHub API error: ${res.status}` };
          }

          const events = await res.json();
          const pushEvents = events
            .filter((e: { type: string }) => e.type === "PushEvent")
            .slice(0, 5);

          logAudit("github", "Get Recent Activity", "GET /events", "success");
          return {
            status: "ok",
            count: pushEvents.length,
            recentActivity: pushEvents.map((e: { repo: { name: string }; payload: { commits: { message: string }[] }; created_at: string }) => ({
              repo: e.repo.name,
              commits: e.payload.commits?.map((c: { message: string }) => c.message.split("\n")[0]).slice(0, 3),
              date: e.created_at,
            })),
          };
        } catch (err) {
          return { status: "error", message: String(err) };
        }
      },
    })
  ),

  getNotifications: withGitHubConnection(
    tool({
      description:
        "Get unread GitHub notifications (mentions, review requests, assignments).",
      parameters: zodSchema(z.object({})),
      execute: async () => {
        try {
          const credentials = getAccessTokenFromTokenVault();
          const token = credentials?.accessToken;
          if (!token) {
            return {
              status: "not_connected",
              message: "GitHub is not connected. Visit /dashboard/permissions to connect it.",
            };
          }

          const res = await fetch(
            "https://api.github.com/notifications?per_page=10",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!res.ok) {
            return { status: "error", message: `GitHub API error: ${res.status}` };
          }

          const notifications = await res.json();
          logAudit("github", "Get Notifications", "GET /notifications", "success");
          return {
            status: "ok",
            count: notifications.length,
            notifications: notifications.slice(0, 10).map((n: { subject: { title: string; type: string }; repository: { full_name: string }; reason: string; updated_at: string }) => ({
              title: n.subject.title,
              type: n.subject.type,
              repo: n.repository.full_name,
              reason: n.reason,
              updated: n.updated_at,
            })),
          };
        } catch (err) {
          return { status: "error", message: String(err) };
        }
      },
    })
  ),
};
