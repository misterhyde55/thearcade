"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Ban, Link as LinkIcon, LogIn, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";

type Tab = "profile" | "notifications" | "privacy";

const AVATAR_COLORS = ["#ff3b4e", "#e0339c", "#8b5cf6", "#22d3ee", "#ffb020"];

const INITIAL_BLOCKED = [
  { id: "b1", username: "spam_bot_44" },
  { id: "b2", username: "toxic_guest_7" }
];

export default function SettingsPage() {
  const { isSignedIn, viewer } = useDemoSession();
  const [tab, setTab] = useState<Tab>("profile");
  const { push } = useToast();

  const [displayName, setDisplayName] = useState(viewer.displayName);
  const [bio, setBio] = useState("");
  const [avatarColor, setAvatarColor] = useState(viewer.avatarColor);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);

  const [notifyFollow, setNotifyFollow] = useState(true);
  const [notifyLive, setNotifyLive] = useState(true);
  const [notifyMention, setNotifyMention] = useState(true);
  const [notifySystem, setNotifySystem] = useState(false);

  const [blocked, setBlocked] = useState(INITIAL_BLOCKED);

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={LogIn}
          title="Sign in to view settings"
          description="Profile, notifications, and privacy settings are available once you're signed in."
          action={
            <Link href="/login" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
              Log in
            </Link>
          }
        />
      </div>
    );
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    push({ kind: "success", title: "Profile saved" });
  }

  function saveNotifications() {
    push({ kind: "success", title: "Notification preferences saved" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-xl font-semibold text-ink">Settings</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Settings sections">
          {(
            [
              { id: "profile", label: "Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy & blocked", icon: Ban }
            ] as { id: Tab; label: string; icon: typeof User }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={`focus-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                tab === t.id ? "bg-surface-panel2 text-ink" : "text-ink-muted hover:bg-surface-panel2 hover:text-ink"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === "profile" && (
            <form onSubmit={saveProfile} className="space-y-5 rounded-lg border border-surface-border bg-surface-panel p-5">
              <div className="flex items-center gap-3">
                <Avatar color={avatarColor} initials={viewer.avatarInitials} size={56} />
                <div>
                  <p className="mb-1.5 text-xs font-medium text-ink-muted">Avatar color</p>
                  <div className="flex gap-1.5">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAvatarColor(c)}
                        aria-label={`Choose color ${c}`}
                        aria-pressed={avatarColor === c}
                        className={`h-6 w-6 rounded-full ${avatarColor === c ? "ring-2 ring-offset-2 ring-offset-surface-panel ring-ink" : ""}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Display name</span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="focus-ring w-full max-w-sm rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="focus-ring w-full max-w-lg rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
                  placeholder="Tell viewers about yourself"
                />
              </label>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <LinkIcon size={12} /> Social links
                </p>
                <div className="space-y-2">
                  {links.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={l.label}
                        onChange={(e) => setLinks((prev) => prev.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))}
                        placeholder="Label"
                        className="focus-ring w-28 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none"
                      />
                      <input
                        value={l.url}
                        onChange={(e) => setLinks((prev) => prev.map((x, xi) => (xi === i ? { ...x, url: e.target.value } : x)))}
                        placeholder="https://…"
                        className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
                  className="focus-ring mt-2 text-xs text-brand-cyan hover:underline"
                >
                  + Add another link
                </button>
              </div>
              <button type="submit" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
                Save profile
              </button>
            </form>
          )}

          {tab === "notifications" && (
            <div className="space-y-3 rounded-lg border border-surface-border bg-surface-panel p-5">
              {[
                { label: "New followers", state: notifyFollow, set: setNotifyFollow },
                { label: "Followed channels going live", state: notifyLive, set: setNotifyLive },
                { label: "Mentions in chat", state: notifyMention, set: setNotifyMention },
                { label: "Platform announcements", state: notifySystem, set: setNotifySystem }
              ].map((row) => (
                <label key={row.label} className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5">
                  <span className="text-sm text-ink">{row.label}</span>
                  <input type="checkbox" checked={row.state} onChange={(e) => row.set(e.target.checked)} className="accent-brand-magenta" />
                </label>
              ))}
              <button onClick={saveNotifications} className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
                Save preferences
              </button>
            </div>
          )}

          {tab === "privacy" && (
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Blocked users</h2>
              {blocked.length === 0 ? (
                <p className="text-sm text-ink-muted">You haven&apos;t blocked anyone.</p>
              ) : (
                <ul className="space-y-2">
                  {blocked.map((b) => (
                    <li key={b.id} className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2">
                      <span className="text-sm text-ink">{b.username}</span>
                      <button
                        onClick={() => {
                          setBlocked((prev) => prev.filter((x) => x.id !== b.id));
                          push({ kind: "info", title: `Unblocked ${b.username}` });
                        }}
                        className="focus-ring rounded-md border border-surface-border px-2.5 py-1 text-xs text-ink-muted hover:text-ink"
                      >
                        Unblock
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
