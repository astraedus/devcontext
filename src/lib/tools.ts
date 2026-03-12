// Agent tool definitions — placeholder
// Defines tools the AI agent can call, backed by Auth0 Token Vault tokens

// TODO: Implement tools using Vercel AI SDK's `tool()` helper
// import { tool } from "ai";
// import { z } from "zod";

// export const githubTools = {
//   listPullRequests: tool({
//     description: "List open pull requests for the authenticated user",
//     parameters: z.object({ repo: z.string().optional() }),
//     execute: async ({ repo }) => {
//       // Use Auth0 Token Vault to get GitHub token
//       // Call GitHub API
//     },
//   }),
// };

export const toolDefinitions = {
  github: ["listPullRequests", "getRecentCommits", "getNotifications"],
  googleCalendar: ["listUpcomingEvents", "getTodaySchedule"],
  slack: ["getUnreadMessages", "getChannelSummary"],
};
