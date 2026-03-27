import Link from "next/link";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ToggleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
      <circle cx="16" cy="12" r="3" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

const providers = [
  {
    name: "GitHub",
    description: "Pull requests, commits, notifications, and review assignments",
    icon: <GithubIcon />,
    color: "text-white",
    bg: "bg-white/5",
    border: "border-white/10",
  },
  {
    name: "Google Calendar",
    description: "Upcoming meetings, scheduling context, and daily schedule",
    icon: <CalendarIcon />,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    name: "Slack",
    description: "Unread messages, channel summaries, and team mentions",
    icon: <SlackIcon />,
    color: "text-purple-400",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
  },
];

const features = [
  {
    icon: <ShieldIcon />,
    title: "Security Model",
    description:
      "OAuth tokens stored in Auth0 Token Vault. Your app never sees raw provider credentials. RFC 8693 token exchange ensures scoped, time-limited access.",
  },
  {
    icon: <ToggleIcon />,
    title: "User Control",
    description:
      "Grant or revoke access per service instantly. The Permission Control Center shows exactly what your AI can and cannot access.",
  },
  {
    icon: <ListIcon />,
    title: "Audit Trail",
    description:
      "Every token exchange is logged. See which services the AI accessed, when, and what data it retrieved. Full transparency.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-semibold text-sm tracking-tight">DevContext</span>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/astraedus/devcontext"
            className="text-xs text-white/40 hover:text-white transition-colors"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            href="/auth/login?returnTo=/dashboard"
            prefetch={false}
            className="text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Built on Auth0 Token Vault
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1]">
          Your AI Knows Your
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Developer Context
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/50 max-w-xl leading-relaxed">
          Connect GitHub, Calendar, and Slack. Ask your AI assistant anything
          about your work. Control exactly what it can access.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login?returnTo=/dashboard"
            prefetch={false}
            className="inline-flex items-center justify-center rounded-xl bg-white text-black font-medium px-6 py-3 text-sm hover:bg-white/90 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="https://github.com/astraedus/devcontext"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 font-medium px-6 py-3 text-sm hover:bg-white/10 transition-colors"
            target="_blank"
          >
            View Source
          </Link>
        </div>

        {/* Provider cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {providers.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border ${p.border} ${p.bg} p-5 text-left`}
            >
              <div className={`mb-3 ${p.color}`}>{p.icon}</div>
              <h3 className="text-sm font-semibold mb-1">{p.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24 max-w-3xl w-full">
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <p className="text-sm text-white/40 mb-10">
            Three steps to AI-powered developer briefings with full control
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-2">01</div>
              <h3 className="text-sm font-semibold mb-1">Connect Services</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Sign in with Auth0 and connect GitHub, Google Calendar, and Slack.
                OAuth tokens are stored securely in Auth0 Token Vault.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-2">02</div>
              <h3 className="text-sm font-semibold mb-1">Set Permissions</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Control exactly what the AI can access. Grant read-only GitHub
                access, limit Calendar visibility, or revoke Slack entirely.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-2">03</div>
              <h3 className="text-sm font-semibold mb-1">Ask Anything</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                &ldquo;Brief me for standup&rdquo;, &ldquo;What PRs need my review?&rdquo;,
                &ldquo;Summarize #engineering&rdquo;. The AI fetches real data through Token Vault.
              </p>
            </div>
          </div>
        </div>

        {/* Security features */}
        <div className="mt-24 max-w-3xl w-full">
          <h2 className="text-2xl font-bold mb-2">Built for Trust</h2>
          <p className="text-sm text-white/40 mb-10">
            The permission model isn&apos;t an afterthought &mdash; it&apos;s the product
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="text-emerald-400 mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="mt-24 max-w-2xl w-full rounded-xl border border-white/10 bg-white/[0.02] p-6 text-left">
          <h3 className="text-sm font-semibold mb-4 text-center">Architecture</h3>
          <pre className="text-xs text-white/50 font-mono leading-relaxed overflow-x-auto">
{`User  -->  Auth0 Login  -->  Token Vault stores OAuth tokens
                                |
Next.js App  -->  AI SDK  -->  Claude / Gemini (tool calls)
                                |
Tool: "listPullRequests"  -->  Token Vault exchange  -->  GitHub API
Tool: "getTodaySchedule"  -->  Token Vault exchange  -->  Calendar API
Tool: "getUnreadMessages" -->  Token Vault exchange  -->  Slack API
                                |
Streaming response  -->  Chat UI  +  Audit Log`}
          </pre>
        </div>

        {/* Tech stack */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs text-white/30">
          <span className="border border-white/10 rounded-full px-3 py-1">Next.js 16</span>
          <span className="border border-white/10 rounded-full px-3 py-1">@auth0/nextjs-auth0 v4</span>
          <span className="border border-white/10 rounded-full px-3 py-1">@auth0/ai-vercel</span>
          <span className="border border-white/10 rounded-full px-3 py-1">Vercel AI SDK</span>
          <span className="border border-white/10 rounded-full px-3 py-1">Tailwind CSS</span>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-2 text-xs text-white/20">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Built for the Auth0 &ldquo;Authorized to Act&rdquo; Hackathon
        </div>
      </div>
    </main>
  );
}
