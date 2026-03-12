import { AuditLog } from "@/components/AuditLog";

export default function AuditPage() {
  return (
    <>
      <header className="flex h-14 items-center border-b border-white/10 px-6">
        <h1 className="text-sm font-semibold text-white/80">Audit Trail</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <p className="mb-2 text-sm font-medium text-white">Access Log</p>
          <p className="mb-8 text-sm text-white/50">
            Every token exchange and service access is logged here. All times
            are in UTC.
          </p>
          <AuditLog />
        </div>
      </div>
    </>
  );
}
