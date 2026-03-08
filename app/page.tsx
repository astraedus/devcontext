import { Sidebar } from "@/components/sidebar";
import { ChatPanel } from "@/components/chat-panel";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-border px-6">
          <h1 className="text-base font-semibold">Chat</h1>
        </header>
        <ChatPanel />
      </main>
    </div>
  );
}
