"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Shield, ClipboardList } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/permissions", label: "Permissions", icon: Shield },
  { href: "/dashboard/audit", label: "Audit Log", icon: ClipboardList },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/10 bg-white/[0.02]">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <span className="text-sm font-semibold tracking-tight text-white">
          DevContext
        </span>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/auth/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Sign out
        </Link>
      </div>
    </aside>
  );
}
