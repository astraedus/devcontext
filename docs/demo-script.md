# DevContext Demo Video Script (3 minutes)

## Scene 1: The Problem (0:00 - 0:20)
**Visual**: Split screen showing GitHub, Calendar, Slack tabs
**Voiceover**: "Every morning, developers spend 30 minutes jumping between GitHub, Calendar, and Slack just to figure out what needs attention. AI assistants could help, but they need access to your APIs. And right now, there's no secure way to grant that access."

## Scene 2: DevContext Introduction (0:20 - 0:40)
**Visual**: Landing page at devcontext-two.vercel.app, click "Get Started"
**Voiceover**: "DevContext is an AI developer assistant that pulls your work context into one conversation. But unlike other AI tools, it uses Auth0 Token Vault to manage every API token securely."

## Scene 3: Login Flow (0:40 - 1:00)
**Visual**: Auth0 login page, sign in with Google
**Voiceover**: "Sign in with Auth0. Your identity is verified, and your OAuth tokens are stored in Token Vault. Not in environment variables. Not in a database. In a purpose-built secure vault."

## Scene 4: Permission Control Center (1:00 - 1:30)
**Visual**: Navigate to Permissions page, show three provider cards
**Voiceover**: "The Permission Control Center shows exactly which services the AI can access. GitHub for pull requests and notifications. Google Calendar for your schedule. Slack for messages. Each connection is scoped. You control what the agent can see."

## Scene 5: AI Chat with Tool Calling (1:30 - 2:15)
**Visual**: Navigate to Chat, type "What's my morning briefing?", watch tools execute
**Voiceover**: "Ask for your morning briefing and the AI calls your connected services through Token Vault. Watch the tools execute in real-time. Each call uses a scoped, time-limited token exchanged on demand. The AI never sees your raw credentials."

## Scene 6: Audit Trail (2:15 - 2:45)
**Visual**: Navigate to Audit Log, show entries with timestamps and status badges
**Voiceover**: "Every API call is logged in the audit trail. Provider, action, endpoint, timestamp, status. You can see exactly what the AI did, when it did it, and whether it succeeded. If a tool was denied access, that's logged too. Complete transparency."

## Scene 7: Closing (2:45 - 3:00)
**Visual**: Back to landing page, show GitHub link
**Voiceover**: "DevContext. Secure AI agent authorization with Auth0 Token Vault. Open source on GitHub. Try it now."
