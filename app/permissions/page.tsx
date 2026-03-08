import { Sidebar } from "@/components/sidebar";
import { PermissionCard } from "@/components/permission-card";

export default function PermissionsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-border px-6">
          <h1 className="text-base font-semibold">Permission Control Center</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-6 text-sm text-muted-foreground">
            Manage which services your AI agent can access. Revoke access at any time.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PermissionCard service="GitHub" connected={false} scopes={["repo", "read:user"]} />
            <PermissionCard service="Google Calendar" connected={false} scopes={["calendar.readonly"]} />
            <PermissionCard service="Slack" connected={false} scopes={["channels:history", "users:read"]} />
          </div>
        </div>
      </main>
    </div>
  );
}
