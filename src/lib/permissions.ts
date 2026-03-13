/**
 * Per-user, per-provider permission overrides.
 *
 * Users can "revoke" a connected provider to block AI access
 * without disconnecting their Auth0 identity. This demonstrates
 * fine-grained user control over AI data access.
 *
 * Uses globalThis for persistence across warm serverless invocations.
 * For production, this would use a database.
 */

import { auth0 } from "./auth0";
import { logAudit } from "./audit";

const globalPerms = globalThis as unknown as {
  __permissionOverrides?: Map<string, boolean>;
};
if (!globalPerms.__permissionOverrides) {
  globalPerms.__permissionOverrides = new Map();
}
const overrides = globalPerms.__permissionOverrides;

function key(userSub: string, providerId: string): string {
  return `${userSub}:${providerId}`;
}

export function isProviderRevoked(userSub: string, providerId: string): boolean {
  return overrides.get(key(userSub, providerId)) === true;
}

export function setProviderRevoked(
  userSub: string,
  providerId: string,
  revoked: boolean
): void {
  if (revoked) {
    overrides.set(key(userSub, providerId), true);
  } else {
    overrides.delete(key(userSub, providerId));
  }
}

export function getPermissionOverrides(
  userSub: string
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const [k, v] of overrides.entries()) {
    if (k.startsWith(`${userSub}:`)) {
      result[k.split(":")[1]] = v;
    }
  }
  return result;
}

/**
 * Check if a provider is accessible for the current user.
 * Call this at the start of every tool's execute function.
 */
export async function checkProviderAccess(
  providerId: string
): Promise<
  | { allowed: true }
  | { allowed: false; result: { status: string; message: string } }
> {
  try {
    const session = await auth0.getSession();
    if (session?.user) {
      const sub = (session.user as Record<string, unknown>).sub as string;
      if (isProviderRevoked(sub, providerId)) {
        logAudit(
          providerId,
          "Permission Check",
          "Access revoked by user",
          "denied"
        );
        return {
          allowed: false,
          result: {
            status: "access_revoked",
            message: `${providerId} access has been revoked by you. Visit /dashboard/permissions to re-enable it.`,
          },
        };
      }
    }
  } catch {
    // If session check fails, allow access (fail open for demo)
  }
  return { allowed: true };
}
