"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PermissionCardProps {
  service: string;
  connected: boolean;
  scopes: string[];
}

export function PermissionCard({ service, connected, scopes }: PermissionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{service}</CardTitle>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Connected" : "Not connected"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {connected
            ? "Your AI agent can access this service."
            : "Connect to allow your AI agent to access this service."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scopes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {scopes.map((scope) => (
              <Badge key={scope} variant="outline" className="text-xs font-mono">
                {scope}
              </Badge>
            ))}
          </div>
        )}
        <Button
          variant={connected ? "destructive" : "default"}
          size="sm"
          className="w-full"
        >
          {connected ? "Revoke Access" : `Connect ${service}`}
        </Button>
      </CardContent>
    </Card>
  );
}
