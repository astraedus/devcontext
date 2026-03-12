# DevContext

> AI-Powered Developer Briefings via Auth0 Token Vault

DevContext is an AI developer context agent that connects GitHub, Google Calendar, and Slack through Auth0 Token Vault. Ask it anything about your work — open PRs, today's meetings, unread Slack messages — and it fetches live data on your behalf using securely managed OAuth tokens.

Built for the Auth0 AI Hackathon.

---

## Screenshot

![DevContext Dashboard](docs/screenshot-placeholder.png)

---

## Features

- **Chat interface** with Claude (claude-opus-4-5) and streaming responses
- **Auth0 Token Vault** for secure, scoped OAuth token management
- **Permission Control Center** — see exactly what the agent can access, revoke instantly
- **Audit trail** — every token exchange and service access logged
- **Three integrations**: GitHub, Google Calendar, Slack

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, TypeScript) |
| Auth | Auth0 (`@auth0/nextjs-auth0` v4) |
| Token management | Auth0 Token Vault |
| AI | Claude via Vercel AI SDK (`@ai-sdk/anthropic`) |
| Styling | Tailwind CSS v4 |

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
AUTH0_SECRET=          # openssl rand -hex 32
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.auth0.com
AUTH0_CLIENT_ID=       # Auth0 application client ID
AUTH0_CLIENT_SECRET=   # Auth0 application client secret
ANTHROPIC_API_KEY=     # Anthropic API key
```

### 3. Configure Auth0

In your Auth0 dashboard:

1. Create a Regular Web Application
2. Add `http://localhost:3000/api/auth/callback` as an allowed callback URL
3. Add `http://localhost:3000` as an allowed logout URL
4. Enable Social Connections: GitHub, Google, Slack
5. Enable Token Vault for each connection

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    layout.tsx              Root layout with Auth0Provider
    page.tsx                Landing page
    dashboard/
      layout.tsx            Auth-protected layout with sidebar
      page.tsx              Chat interface
      permissions/page.tsx  Permission Control Center
      audit/page.tsx        Audit trail
    api/
      auth/[...auth0]/      Auth0 route handlers
      chat/                 Streaming chat endpoint (Vercel AI SDK)
      tokens/               Token status + per-provider exchange
  lib/
    auth0.ts                Auth0 config reference
    token-vault.ts          Token Vault helper functions
    types.ts                TypeScript interfaces
    tools/
      github.ts             GitHub tool definitions
      calendar.ts           Google Calendar tool definitions
      slack.ts              Slack tool definitions
  components/
    Sidebar.tsx             Navigation
    ChatPanel.tsx           Chat UI with streaming
    PermissionCard.tsx      Per-provider permission toggle
    AuditLog.tsx            Audit trail display
```

## License

MIT
