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

Auth0 Token Vault takes a fundamentally different approach. Instead of giving the AI a static token, it gives the AI a **mechanism to request tokens on demand** via RFC 8693 token exchange.

Here's how it works in DevContext:

```typescript
import { getAccessTokenFromTokenVault } from "@auth0/ai-vercel";

export const githubTools = {
  listPullRequests: tool({
    description: "List open pull requests",
    execute: async ({ filter }) => {
      // Check user's permission override first
      const access = await checkProviderAccess("github");
      if (!access.allowed) return access.result;

      // Request a scoped, time-limited token from Token Vault
      let token: string;
      try {
        token = getAccessTokenFromTokenVault();
      } catch {
        return { status: "not_connected", message: "GitHub is not connected." };
      }

      // Use the token for exactly this API call
      const res = await fetch("https://api.github.com/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ...
    },
  }),
};
```

The AI tool never stores a token. It requests one from Token Vault, uses it for that specific API call, and the token is scoped to exactly the permissions the user granted.

## The Permission Layer Most Apps Skip

Token Vault handles secure token storage and exchange. But we asked: **what if the user wants to block the AI from using a connected service, without disconnecting entirely?**

This is the difference between "I want to unlink my GitHub" and "I want the AI to stop reading my repos for now." The first is destructive. The second is a permission toggle.

DevContext implements this with a Permission Control Center:

```typescript
export async function checkProviderAccess(providerId: string) {
  const session = await auth0.getSession();
  if (session?.user) {
    const sub = session.user.sub;
    if (isProviderRevoked(sub, providerId)) {
      logAudit(providerId, "Permission Check", "Access revoked by user", "denied");
      return {
        allowed: false,
        result: {
          status: "access_revoked",
          message: `${providerId} access has been revoked. Visit Permissions to re-enable.`,
        },
      };
    }
  }
  return { allowed: true };
}
```

Every tool calls `checkProviderAccess()` before attempting a Token Vault exchange. If the user revoked access, the tool returns immediately with a clear message, and the AI gracefully adapts.

The UI shows three states per service:
- **Connected** (green) -- tokens available, AI can access
- **Revoked** (amber) -- tokens exist but AI is blocked
- **Not connected** (gray) -- no Auth0 identity linked

Revoking is instant. Re-enabling is instant. The underlying OAuth connection stays intact.

## Tool Call Transparency

When the AI processes a request like "Brief me for standup," it calls multiple tools across services. DevContext makes this visible in real-time:

Each tool call appears as a status indicator in the chat, color-coded by provider -- white for GitHub, blue for Calendar, purple for Slack. Users see "Fetching Pull Requests..." with a spinner, then a checkmark when complete.

This isn't just aesthetic polish. It directly answers the question every user should be asking: **"What is the AI doing with my data right now?"**

## The Audit Trail

Every token exchange and permission check is logged:

```typescript
export function logAudit(
  provider: string,
  action: string,
  endpoint: string,
  status: "success" | "denied" | "error"
) {
  auditLog.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    provider,
    action,
    endpoint,
    status,
  });
}
```

The audit page shows a timeline: which services were accessed, what API endpoints were called, whether access was granted or denied, and when. If a user revokes Slack access, they can see the "denied" entries proving the AI respected the revocation.

## The Architecture

DevContext uses the Vercel AI SDK with multi-step tool calling:

```
User --> Auth0 Login --> Token Vault stores OAuth tokens
                              |
Next.js App --> AI SDK --> Claude / Gemini (tool calls)
                              |
checkProviderAccess() --> Permission check (pass/deny)
                              |
getAccessTokenFromTokenVault() --> Token Vault exchange --> Provider API
                              |
Streaming response --> Chat UI + Tool Indicators + Audit Log
```

8 tools across three services, each going through the same permission check + Token Vault pipeline. Adding a new service means creating a new tool file and a new Auth0 social connection.

## Why This Matters

The AI agent ecosystem is about to explode. Every SaaS product will have AI integrations. Every developer will have AI assistants accessing their tools.

The question isn't whether AI agents will access our APIs. It's whether that access will be:

1. **Scoped** -- only the permissions the user granted
2. **Auditable** -- every access logged and visible
3. **Revocable** -- instantly, without breaking anything
4. **Transparent** -- users can see what the AI is doing in real-time

Auth0 Token Vault makes the secure path the easy path. DevContext proves you can build a genuinely useful AI agent where authorization is the foundation, not a checkbox.

---

*DevContext is open source at [github.com/astraedus/devcontext](https://github.com/astraedus/devcontext). Try it at [devcontext-two.vercel.app](https://devcontext-two.vercel.app). Built for the [Auth0 "Authorized to Act" Hackathon](https://authorizedtoact.devpost.com/).*
