# How Auth0 Token Vault Changes the Trust Model for AI Agents

AI agents are getting access to more of our tools every day. GitHub, Slack, Calendar, CRM, databases. But there's a fundamental question most developers skip: **how do you give an AI access to your APIs without giving away the keys to the kingdom?**

When I built DevContext, an AI developer assistant that pulls context from GitHub, Google Calendar, and Slack, this wasn't a theoretical concern. It was the core architectural decision.

## The Problem with API Keys in AI Applications

The naive approach is simple: take your GitHub personal access token, put it in an environment variable, and let the AI use it. This is how most AI integrations work today.

The problems are obvious once you think about them:

1. **No scoping**: The AI gets the same permissions as you. If your PAT can delete repos, so can the AI.
2. **No expiration**: Tokens live forever in env vars. If the AI is compromised, the token is compromised.
3. **No audit trail**: You have no visibility into what the AI actually did with your token.
4. **No revocation**: To revoke access, you have to rotate the entire token, breaking everything else that uses it.

For a toy demo, this doesn't matter. For anything you'd actually use in production, it's a dealbreaker.

## Enter Token Vault

Auth0 Token Vault takes a fundamentally different approach. Instead of giving the AI a static token, it gives the AI a **mechanism to request tokens on demand**.

Here's how it works in DevContext:

```typescript
import { getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { withGitHubConnection } from "../auth0-ai";

export const githubTools = {
  listPullRequests: withGitHubConnection(
    tool({
      description: "List open pull requests",
      execute: async ({ filter }) => {
        const credentials = getAccessTokenFromTokenVault();
        const token = credentials?.accessToken;
        if (!token) {
          return { status: "not_connected" };
        }
        // Use the scoped, time-limited token
        const res = await fetch("https://api.github.com/issues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ...
      },
    })
  ),
};
```

The `withGitHubConnection` wrapper handles the Token Vault exchange automatically. The AI tool never stores a token. It requests one, uses it for that specific API call, and the token is scoped to exactly the permissions the user granted.

## What This Enables

With Token Vault as the authorization layer, DevContext can offer something most AI assistants cannot: **verifiable trust**.

**Permission Control Center**: Users see exactly which services the AI can access, with what scopes. They can connect Google Calendar for read-only access without worrying about the AI creating or deleting events.

**Audit Trail**: Every Token Vault exchange and API call is logged. Users can see that at 9:47 AM, the AI requested a GitHub token, called `GET /issues?filter=review-requested`, and got 3 results. Full transparency.

**Instant Revocation**: Disconnect a service and the next Token Vault exchange returns null. The AI gracefully tells the user to reconnect. No dangling tokens, no cleanup.

**Graceful Degradation**: When a service isn't connected, the tool returns `not_connected` instead of crashing. The AI can still help with the services that ARE connected.

## The Architecture

DevContext uses the Vercel AI SDK with multi-step tool calling. The AI has access to 8 tools across three services:

- **GitHub**: `listPullRequests`, `getRecentCommits`, `getNotifications`
- **Google Calendar**: `listUpcomingEvents`, `getTodaySchedule`
- **Slack**: `getUnreadMessages`, `getChannelSummary`

Each tool is wrapped with its corresponding Token Vault connection (`withGitHubConnection`, `withGoogleConnection`, `withSlackConnection`). The wrapping is declarative and composable. Adding a new service means creating a new tool file and a new Token Vault connection in Auth0.

The key insight: **the authorization layer is not bolted on after the fact. It's the foundation the entire tool system is built on.** Every tool call goes through Token Vault. There's no backdoor, no shortcut, no "just use the env var for now."

## Why This Matters

The AI agent ecosystem is about to explode. Every SaaS product will have AI integrations. Every developer will have AI assistants accessing their tools.

The question isn't whether AI agents will access our APIs. It's whether that access will be secure, auditable, and revocable by default.

Auth0 Token Vault makes the secure path the easy path. That's what good security infrastructure does. It doesn't make developers work harder. It makes the right thing the default thing.

DevContext is our proof that you can build a genuinely useful AI agent where authorization isn't a checkbox. It's the product.

---

*DevContext is open source at [github.com/astraedus/devcontext](https://github.com/astraedus/devcontext). Try it at [devcontext-two.vercel.app](https://devcontext-two.vercel.app).*
