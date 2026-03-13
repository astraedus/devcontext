"use client";

import { useChat } from "@ai-sdk/react";
import { SendHorizonal, Loader2, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const TOOL_LABELS: Record<string, { label: string; provider: string }> = {
  listPullRequests: { label: "Fetching Pull Requests", provider: "github" },
  getRecentCommits: { label: "Fetching Recent Commits", provider: "github" },
  getNotifications: { label: "Checking Notifications", provider: "github" },
  listUpcomingEvents: { label: "Checking Calendar", provider: "google-calendar" },
  getTodaySchedule: { label: "Loading Today's Schedule", provider: "google-calendar" },
  getUnreadMessages: { label: "Checking Slack Messages", provider: "slack" },
  getChannelSummary: { label: "Summarizing Channel", provider: "slack" },
  getServerTime: { label: "Checking Server", provider: "system" },
};

const PROVIDER_COLORS: Record<string, string> = {
  github: "border-white/20 bg-white/5 text-white/70",
  "google-calendar": "border-blue-500/20 bg-blue-500/5 text-blue-400",
  slack: "border-purple-500/20 bg-purple-500/5 text-purple-400",
  system: "border-white/10 bg-white/5 text-white/40",
};

const SUGGESTIONS = [
  "Brief me for standup",
  "What PRs need my review?",
  "What's on my calendar today?",
  "Summarize my unread messages",
];

function ToolCallIndicator({ toolName, state }: { toolName: string; state: string }) {
  const info = TOOL_LABELS[toolName] || { label: toolName, provider: "system" };
  const colors = PROVIDER_COLORS[info.provider] || PROVIDER_COLORS.system;
  const isDone = state === "result";

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${colors}`}>
      {isDone ? (
        <Check className="h-3 w-3" />
      ) : (
        <Loader2 className="h-3 w-3 animate-spin" />
      )}
      {info.label}
    </div>
  );
}

export function ChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm DevContext. Ask me anything about your work -- open PRs, today's meetings, unread Slack messages. Connect your services in **Permissions** to get started.",
      },
    ],
  });

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 border border-white/10 text-white/90"
                  )}
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-code:text-emerald-400 prose-a:text-blue-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 text-white/40">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking...
                      </span>
                    )
                  ) : (
                    message.content
                  )}
                </div>
              </div>

              {/* Tool call indicators */}
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {message.toolInvocations.map((tool: { toolName: string; state: string }, i: number) => (
                    <ToolCallIndicator
                      key={`${message.id}-tool-${i}`}
                      toolName={tool.toolName}
                      state={tool.state}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator when AI is generating */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="flex items-center gap-2 text-white/40 text-sm">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion chips */}
      {!hasUserMessages && (
        <div className="px-6 pb-2">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3 text-xs text-white/30">
              <Sparkles className="h-3 w-3" />
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => append({ role: "user", content: s })}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 max-w-2xl mx-auto"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your PRs, meetings, or Slack messages..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 focus:bg-white/[0.08] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
