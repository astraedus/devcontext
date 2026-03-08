"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AuditEntry {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  status: "success" | "denied" | "error";
}

const PLACEHOLDER_ENTRIES: AuditEntry[] = [
  {
    id: "1",
    timestamp: "No activity yet",
    service: "—",
    action: "Connect services to see audit entries here.",
    status: "success",
  },
];

const statusVariant: Record<AuditEntry["status"], "default" | "secondary" | "destructive"> = {
  success: "default",
  denied: "secondary",
  error: "destructive",
};

export function AuditLog() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border border-border">
      <div className="p-4">
        {PLACEHOLDER_ENTRIES.map((entry, index) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-4 py-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{entry.action}</p>
                <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {entry.service !== "—" && (
                  <Badge variant="outline" className="text-xs">
                    {entry.service}
                  </Badge>
                )}
                <Badge variant={statusVariant[entry.status]} className="text-xs">
                  {entry.status}
                </Badge>
              </div>
            </div>
            {index < PLACEHOLDER_ENTRIES.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
