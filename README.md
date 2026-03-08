# DevContext - AI Developer Context Agent

AI agent providing contextual briefings by connecting GitHub, Google Calendar, and Slack via Auth0 Token Vault.

## Features
- Chat-based developer assistant
- Permission Control Center - see and control what your AI can access
- Audit trail - every token exchange logged
- Graceful degradation - revoke services, AI adapts

## Stack
- Next.js 15 (App Router)
- Auth0 Token Vault for AI Agents
- Vercel AI SDK + Claude
- Tailwind CSS + shadcn/ui

## Setup
1. Copy `.env.example` to `.env.local`
2. Configure Auth0 credentials
3. `npm install && npm run dev`

## License
MIT
