"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Gift, Heart, MessageSquareWarning, Radio, ShieldAlert, Sparkles } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { useDemoSession } from "@/lib/demo-session";
import { formatRelativeTime } from "@/lib/format";
import type { NotificationKind } from "@/lib/types";

const ICONS: Record<NotificationKind, typeof Bell> = {
  follow: Heart,
  subscription: Gift,
  live: Radio,
  mention: MessageSquareWarning,
  moderation: ShieldAlert,
  system: Sparkles,
  clip: Sparkles
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { readNotificationIds, markNotificationRead } = useDemoSession();
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read && !readNotificationIds.includes(n.id)).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="focus-ring relative rounded-md p-2 text-ink-muted hover:bg-surface-panel2 hover:text-ink"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <button aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} tabIndex={-1} />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-lg border border-surface-border bg-surface-panel shadow-card">
            <div className="border-b border-surface-border px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
            </div>
            <ul className="max-h-96 overflow-y-auto">
              {NOTIFICATIONS.map((n) => {
                const Icon = ICONS[n.kind];
                const isRead = n.read || readNotificationIds.includes(n.id);
                const body = (
                  <div className={`flex gap-3 px-4 py-3 ${isRead ? "" : "bg-brand-magenta/[0.04]"}`}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-panel2 text-ink-muted">
                      <Icon size={15} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{n.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-ink-muted">{n.body}</span>
                      <span className="mt-1 block text-[11px] text-ink-faint">{formatRelativeTime(n.createdAt)}</span>
                    </span>
                    {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-cyan" aria-hidden />}
                  </div>
                );
                return (
                  <li key={n.id} className="border-b border-surface-border last:border-0">
                    {n.href ? (
                      <Link href={n.href} onClick={() => markNotificationRead(n.id)} className="block hover:bg-surface-panel2">
                        {body}
                      </Link>
                    ) : (
                      <button onClick={() => markNotificationRead(n.id)} className="block w-full text-left hover:bg-surface-panel2">
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
