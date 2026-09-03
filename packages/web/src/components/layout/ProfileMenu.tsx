"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { viewer, role, signOut } = useDemoSession();
  const { push } = useToast();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="focus-ring flex items-center gap-1.5 rounded-md p-1 pr-2 hover:bg-surface-panel2"
      >
        <Avatar color={viewer.avatarColor} initials={viewer.avatarInitials} size={30} />
        <ChevronDown size={14} className="text-ink-faint" />
      </button>
      {open && (
        <>
          <button aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} tabIndex={-1} />
          <div className="absolute right-0 z-40 mt-2 w-56 rounded-lg border border-surface-border bg-surface-panel py-1.5 shadow-card">
            <div className="border-b border-surface-border px-3.5 py-2.5">
              <p className="truncate text-sm font-semibold text-ink">{viewer.displayName}</p>
              <p className="text-xs text-ink-faint">{role === "creator" ? "Creator account (demo)" : "Viewer account (demo)"}</p>
            </div>
            {role === "creator" && (
              <Link
                href={`/channel/${viewer.username}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink"
              >
                <User size={15} /> Your channel
              </Link>
            )}
            {role === "creator" && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink"
              >
                <LayoutDashboard size={15} /> Creator dashboard
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink"
            >
              <Settings size={15} /> Settings
            </Link>
            <button
              onClick={() => {
                signOut();
                setOpen(false);
                push({ kind: "info", title: "Signed out", description: "You're back to guest browsing." });
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-ink-muted hover:bg-surface-panel2 hover:text-ink"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
