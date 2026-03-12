import { ChatPanel } from "@/components/ChatPanel";

export default function DashboardPage() {
  return (
    <>
      <header className="flex h-14 items-center border-b border-white/10 px-6">
        <h1 className="text-sm font-semibold text-white/80">Chat</h1>
      </header>
      <ChatPanel />
    </>
  );
}
