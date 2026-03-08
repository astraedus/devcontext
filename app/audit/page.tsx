import { Sidebar } from "@/components/sidebar";
import { AuditLog } from "@/components/audit-log";

export default function AuditPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-border px-6">
          <h1 className="text-base font-semibold">Audit Trail</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-6 text-sm text-muted-foreground">
            Every token exchange and service access is logged here.
          </p>
          <AuditLog />
        </div>
      </main>
    </div>
  );
}
