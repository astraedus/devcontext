# DevContext — Lessons Learned

## Auth0 SDK v4 (breaking changes from v3)

**Never use v3 patterns:**
- v3: `import { handleAuth, getSession } from "@auth0/nextjs-auth0"` - DOES NOT EXIST IN v4
- v3: `export const GET = handleAuth()` in `api/auth/[...auth0]` - DOES NOT EXIST IN v4
- v3: `getSession()` as a standalone function - DOES NOT EXIST IN v4

**v4 correct patterns:**
- `import { Auth0Client } from "@auth0/nextjs-auth0/server"` for server-side
- `import { Auth0Provider } from "@auth0/nextjs-auth0"` for client-side (root layout)
- `export const auth0 = new Auth0Client()` — create ONE instance in `src/lib/auth0.ts`
- `auth0.getSession()` — call on the instance, not standalone
- `auth0.middleware(request)` — call in `proxy.ts` (Next.js 16) or `middleware.ts` (Next.js 15)
- Auth routes at `/auth/login`, `/auth/logout`, `/auth/callback` (NOT `/api/auth/*`)
- Env vars: `AUTH0_DOMAIN` (NOT `AUTH0_ISSUER_BASE_URL`), `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`

## Vercel AI SDK v6 (breaking changes from v3/v4)

**Never use:**
- `maxSteps: N` — use `stopWhen: stepCountIs(N)` instead
- `toDataStreamResponse()` — use `toTextStreamResponse()` instead
- `parameters: z.object({...})` in `tool()` — use `inputSchema: zodSchema(z.object({...}))` instead
- `.default()` on zod fields in tool schemas — causes overload resolution failure

**v6 correct patterns:**
- `tool<INPUT, OUTPUT>({ description, inputSchema: zodSchema(schema), execute })` with explicit generics
- `stopWhen: stepCountIs(5)` for multi-step tool calling
- `streamText({ ... }).toTextStreamResponse()` for streaming

## Next.js 16

- Uses `proxy.ts` at root instead of `middleware.ts` (middleware.ts deprecated for Node runtime)
- With `src/` dir: `middleware.ts` goes inside `src/`, `proxy.ts` goes at repo root
- Both work, but proxy.ts is preferred to avoid the deprecation warning

## Tailwind v4 / shadcn v4 (base-nova preset)

- This project uses Tailwind v4 + shadcn v4 (base-nova) — DIFFERENT from Tailwind v3 + shadcn v2
- `shadcn@latest init --defaults` gives base-nova preset
- CSS uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- Color tokens use `oklch()` not `hsl(var(--*))`
- Do NOT mix v3 and v4 patterns
