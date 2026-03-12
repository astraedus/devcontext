# DevContext - DevPost Submission

## Tagline
AI developer assistant with secure, audited access to GitHub, Calendar, and Slack via Auth0 Token Vault

## About

### Inspiration
Developers waste 30+ minutes every morning piecing together context from GitHub PRs, calendar invites, and Slack threads. Meanwhile, AI assistants that could help with this have a fundamental trust problem: they need access to sensitive APIs, but there's no standard way to grant, scope, audit, and revoke that access. We built DevContext to solve both problems at once.

### What it does
DevContext is an AI-powered developer briefing tool. You log in, and the AI agent pulls your open PRs, upcoming meetings, and unread Slack messages into a single conversational interface. But the real innovation is HOW it accesses your data:

- **Token Vault Integration**: Every API token is managed through Auth0 Token Vault. The AI never sees raw credentials. Tokens are scoped, time-limited, and exchanged on-demand.
- **Permission Control Center**: A visual dashboard where you can see exactly which services the agent can access, with what scopes, and toggle them on/off instantly.
- **Full Audit Trail**: Every single API call the agent makes is logged with provider, action, endpoint, timestamp, and status (success/denied/error). You can see exactly what your AI did and when.
- **Graceful Degradation**: If a service isn't connected, the agent tells you and points you to the permissions page. No silent failures, no confusing errors.

### How we built it
- **Next.js 16** with the new proxy.ts middleware convention
- **Auth0 v4 SDK** for authentication and session management
- **Auth0 Token Vault** (`@auth0/ai-vercel`) for secure OAuth token exchange
- **Vercel AI SDK v6** with streaming chat and multi-step tool calling
- **Anthropic Claude** (primary) and **Google Gemini Flash** (fallback) as AI backends
- Three tool families: GitHub (PRs, commits, notifications), Google Calendar (events, today's schedule), Slack (messages, channels)

### Challenges we ran into
1. **Next.js 16 proxy convention**: The new `proxy.ts` must live in `src/` and export a function named `proxy`. Documentation was sparse and we had to debug build output to confirm detection.
2. **Token Vault silent failures**: When Token Vault exchange fails, it returns null rather than throwing. We had to add defensive error handling and audit logging around every exchange.
3. **Serverless state isolation**: Vercel runs each API route in separate function instances, so audit logs stored in module scope were invisible across routes. Solved with `globalThis` for warm-container persistence.
4. **Auth0 identity detection**: The standard OIDC session doesn't include the `identities` array. We parse the `sub` claim prefix to detect connected providers.

### Accomplishments that we're proud of
- The Permission Control Center genuinely feels like how AI agent authorization SHOULD work. Connect, scope, audit, revoke. All in one place.
- The audit trail captures every API interaction in real-time, giving users complete visibility into what their AI agent is doing.
- Graceful multi-provider architecture: add a new service by creating a tool file and a Token Vault connection. The pattern is clean and extensible.

### What we learned
Auth0 Token Vault changes the trust model for AI agents fundamentally. Instead of "give the AI your API key and hope for the best," you get scoped, time-limited, auditable token exchange. The authorization layer isn't an afterthought. It IS the product. The difference between a toy demo and a production-ready AI agent is whether users can trust, verify, and control what it does with their data.

### What's next for DevContext
- Persistent audit storage (database-backed instead of in-memory)
- Per-tool permission toggles (allow calendar reads but block Slack)
- Webhook notifications when the agent accesses sensitive endpoints
- Team dashboards for organizations managing multiple developer agents
- Additional integrations: Jira, Linear, Notion, PagerDuty

## Built With
- auth0
- auth0-token-vault
- nextjs
- react
- typescript
- vercel
- vercel-ai-sdk
- anthropic
- google-gemini
- tailwindcss

## Try it out
- **Live app**: https://devcontext-two.vercel.app
- **GitHub**: https://github.com/astraedus/devcontext
