# DevContext

> AI-Powered Developer Briefings via Auth0 Token Vault

DevContext is an AI developer context agent that connects GitHub, Google Calendar, and Slack through Auth0 Token Vault. Ask it anything about your work -- open PRs, today's meetings, unread Slack messages -- and it fetches live data on your behalf using securely managed OAuth tokens.

**Live**: [devcontext-two.vercel.app](https://devcontext-two.vercel.app)

Built for the [Auth0 "Authorized to Act" Hackathon](https://authorizedtoact.devpost.com/).

---

## How It Works

```
User  -->  Auth0 Login  -->  Token Vault stores OAuth tokens
                                |
Next.js App  -->  AI SDK  -->  Claude / Gemini (tool calls)
                                |
Tool: "listPullRequests"  -->  Token Vault exchange  -->  GitHub API
Tool: "getTodaySchedule"  -->  Token Vault exchange  -->  Calendar API
Tool: "getUnreadMessages" -->  Token Vault exchange  -->  Slack API
                                |
Streaming response  -->  Chat UI  +  Audit Log
```

1. **Connect Services** -- Sign in with Auth0 and connect GitHub, Google Calendar, and Slack. OAuth tokens are stored securely in Auth0 Token Vault.
2. **Set Permissions** -- Control exactly what the AI can access. Grant read-only GitHub access, limit Calendar visibility, or revoke Slack entirely.
3. **Ask Anything** -- "Brief me for standup", "What PRs need my review?", "Summarize #engineering". The AI fetches real data through Token Vault.

## Features

- **Chat interface** with streaming AI responses (Claude Sonnet / Gemini Flash fallback)
- **Auth0 Token Vault** for secure, scoped OAuth token management (RFC 8693 token exchange)
- **Permission Control Center** -- see exactly what the agent can access, revoke instantly
- **Audit trail** -- every token exchange and service access logged
- **Three integrations**: GitHub (PRs, commits, notifications), Google Calendar (events, today's schedule), Slack (messages, channel summaries)
- **Graceful degradation** -- revoke a service and the AI acknowledges the limitation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack, TypeScript) |
| Auth | Auth0 (`@auth0/nextjs-auth0` v4) |
| Token Management | Auth0 Token Vault (`@auth0/ai-vercel`) |
| AI | Vercel AI SDK v6 + Claude Sonnet / Gemini Flash |
| Styling | Tailwind CSS v4 |
| Deploy | Vercel |

## Setup

### 1. Clone and install

```bash
git clone https://github.com/astraedus/devcontext
cd devcontext
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
AUTH0_SECRET=              # openssl rand -hex 32
AUTH0_BASE_URL=http://localhost:3000
AUTH0_APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=              # your-tenant.us.auth0.com
AUTH0_CLIENT_ID=           # Auth0 application client ID
AUTH0_CLIENT_SECRET=       # Auth0 application client secret
ANTHROPIC_API_KEY=         # Optional: Anthropic API key for Claude
GOOGLE_GENERATIVE_AI_API_KEY=  # Optional: Google AI key for Gemini (fallback)
```

### 3. Configure Auth0

In your Auth0 dashboard:

1. Create a **Regular Web Application**
2. Add `http://localhost:3000/auth/callback` as an Allowed Callback URL
3. Add `http://localhost:3000` as an Allowed Logout URL
4. Enable Social Connections: **GitHub**, **Google**, **Slack**
5. For each connection, enable **Token Vault** under Purpose > "Authentication and Connected Accounts for Token Vault"
6. Configure OAuth scopes per connection:
   - GitHub: `repo`, `read:user`, `notifications`
   - Google: `https://www.googleapis.com/auth/calendar.readonly`
   - Slack: `channels:history`, `users:read`, `im:history`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  proxy.ts                  Auth0 proxy middleware (Next.js 16)
  app/
    page.tsx                Landing page
    dashboard/
      layout.tsx            Auth-protected layout with sidebar
      page.tsx              Chat interface
      permissions/page.tsx  Permission Control Center
      audit/page.tsx        Audit trail
    api/
      chat/route.ts         Streaming chat endpoint (Vercel AI SDK)
      audit/route.ts        Audit log API
  lib/
    auth0.ts                Auth0 client (v4)
    auth0-ai.ts             Token Vault connection wrappers
    audit.ts                Audit logging module
    token-vault.ts          Token status checking
    types.ts                TypeScript interfaces
    tools/
      github.ts             GitHub tools (PRs, commits, notifications)
      calendar.ts           Google Calendar tools (events, schedule)
      slack.ts              Slack tools (messages, channels)
  components/
    Sidebar.tsx             Navigation sidebar
    ChatPanel.tsx           Chat UI with streaming
    PermissionCard.tsx      Per-provider permission card
    AuditLog.tsx            Audit trail display
```

## Security Model

- OAuth tokens are **never stored in the application** -- Auth0 Token Vault is the sole credential store
- Token exchange uses **RFC 8693** for scoped, time-limited access tokens
- Every tool call is **logged in the audit trail** with timestamp, provider, and endpoint
- Users can **revoke access per-service** without affecting other connections
- The AI agent only receives tokens **at execution time** through the `@auth0/ai-vercel` SDK

## License

MIT
