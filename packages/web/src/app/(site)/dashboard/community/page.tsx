"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useDemoSession } from "@/lib/demo-session";
import { backendRequiredMessage } from "@/lib/backend-notice";
import { formatCount, formatRelativeTime, formatScheduleTime } from "@/lib/format";
import { BANNED_USERS, MODERATORS, MOD_LOG, VIPS } from "@/lib/mock-data";

type Tab = "audience" | "roles" | "automod" | "announcements" | "schedule";

const TABS: { id: Tab; label: string }[] = [
  { id: "audience", label: "Followers & subscribers" },
  { id: "roles", label: "Moderators, VIPs & bans" },
  { id: "automod", label: "Automod & rules" },
  { id: "announcements", label: "Announcements" },
  { id: "schedule", label: "Schedule" }
];

const DEFAULT_RULES = "Be respectful. No spam or self-promo outside threads. No unlicensed copyrighted media. Follow platform-wide community guidelines.";
const DEFAULT_BLOCKED_WORDS = "freegift, dm-me-for, cheap-followers";

export default function CommunityPage() {
  const { creator } = useDemoSession();
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("audience");
  const [banned, setBanned] = useState(BANNED_USERS);
  const [unbanTarget, setUnbanTarget] = useState<string | null>(null);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [blockedWords, setBlockedWords] = useState(DEFAULT_BLOCKED_WORDS);
  const [postBody, setPostBody] = useState("");
  const [posts, setPosts] = useState<{ id: string; body: string; postedAt: string }[]>([]);
  const [schedule, setSchedule] = useState(creator?.schedule ?? []);
  const [newEntry, setNewEntry] = useState({ title: "", startsAt: "" });

  if (!creator) return null;
  const activeCreator = creator;

  function publishPost() {
    if (!postBody.trim()) return;
    setPosts((prev) => [{ id: `${Date.now()}`, body: postBody.trim(), postedAt: new Date().toISOString() }, ...prev]);
    push({ kind: "success", title: "Posted to followers", description: `Visible to your ${formatCount(activeCreator.followerCount)} followers.` });
    setPostBody("");
  }

  function addScheduleEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!newEntry.title.trim() || !newEntry.startsAt) return;
    setSchedule((prev) => [
      ...prev,
      { id: `${Date.now()}`, title: newEntry.title, category: activeCreator.category, startsAt: new Date(newEntry.startsAt).toISOString(), durationMinutes: 120 }
    ]);
    setNewEntry({ title: "", startsAt: "" });
    push({ kind: "success", title: "Stream scheduled" });
  }

  function cancelScheduleEntry(id: string) {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
    push({ kind: "info", title: "Scheduled stream cancelled" });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">Community</h1>

      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            role="tab"
            className={`focus-ring shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium ${
              tab === t.id ? "border-brand-magenta text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "audience" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <p className="text-2xl font-semibold text-ink">{formatCount(creator.followerCount)}</p>
              <p className="text-xs text-ink-faint">Followers</p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <p className="text-2xl font-semibold text-ink">{formatCount(creator.subscriberCount)}</p>
              <p className="text-xs text-ink-faint">Subscribers</p>
            </div>
          </div>

          <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-1 text-sm font-semibold text-ink">Your data, portable</h2>
            <p className="mb-3 text-xs text-ink-muted">
              Export what legally belongs to you. Private viewer information is never exported without that viewer&apos;s consent — follower
              exports include only what you&apos;re permitted to have (usernames, follow date), never emails or personal details.
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {[
                "Channel analytics",
                "Stream history",
                "VOD metadata",
                "Schedule",
                "Subscriber statistics",
                "Revenue reports",
                "Moderation logs",
                "Permitted follower information"
              ].map((label) => (
                <button
                  key={label}
                  onClick={() => push({ kind: "info", title: `${label} export requested`, description: backendRequiredMessage("storage") })}
                  className="focus-ring flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-left text-sm text-ink-muted hover:border-surface-borderStrong hover:text-ink"
                >
                  {label} <span className="text-xs text-brand-cyan">Export</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => push({ kind: "info", title: "Broadcast download requested", description: backendRequiredMessage("storage") })}
                className="focus-ring rounded-md border border-surface-border px-3.5 py-2 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Download original broadcasts
              </button>
              <button
                onClick={() => push({ kind: "info", title: "Clip download requested", description: backendRequiredMessage("storage") })}
                className="focus-ring rounded-md border border-surface-border px-3.5 py-2 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Download clips
              </button>
            </div>
          </section>
        </div>
      )}

      {tab === "roles" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Moderators</h2>
            <ul className="space-y-1.5">
              {MODERATORS.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{m.username}</span>
                  <span className="text-xs text-ink-faint">{m.actionsLast30d} actions / 30d</span>
                </li>
              ))}
            </ul>
            <h2 className="mb-3 mt-5 text-sm font-semibold text-ink">VIPs</h2>
            <ul className="space-y-1.5">
              {VIPS.map((v) => (
                <li key={v.id} className="text-sm text-ink">
                  {v.username}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Banned users</h2>
            {banned.length === 0 ? (
              <p className="text-sm text-ink-muted">No one is currently banned.</p>
            ) : (
              <ul className="space-y-2">
                {banned.map((b) => (
                  <li key={b.id} className="rounded-md border border-surface-border px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ink">{b.username}</span>
                      <button onClick={() => setUnbanTarget(b.id)} className="focus-ring rounded border border-surface-border px-2 py-0.5 text-xs text-ink-muted hover:text-ink">
                        Unban
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">{b.reason} · by {b.bannedBy}</p>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="mb-2 mt-5 text-sm font-semibold text-ink">Moderator activity log</h2>
            <ul className="space-y-1.5">
              {MOD_LOG.map((l) => (
                <li key={l.id} className="text-xs text-ink-muted">
                  <span className="text-ink">{l.actorUsername}</span> — {l.action} {l.targetUsername !== "—" && <>on {l.targetUsername}</>} · {formatRelativeTime(l.at)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "automod" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Chat rules</h2>
            <textarea value={rules} onChange={(e) => setRules(e.target.value)} rows={4} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
            <button onClick={() => push({ kind: "success", title: "Chat rules updated" })} className="focus-ring mt-2 rounded-md bg-brand-magenta px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-magenta/90">
              Save rules
            </button>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Blocked words (automod)</h2>
            <textarea value={blockedWords} onChange={(e) => setBlockedWords(e.target.value)} rows={4} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" placeholder="Comma-separated terms" />
            <button onClick={() => push({ kind: "success", title: "Blocked word list updated" })} className="focus-ring mt-2 rounded-md bg-brand-magenta px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-magenta/90">
              Save list
            </button>
            <p className="mt-2 text-xs text-ink-faint">{backendRequiredMessage("moderation-ai")}</p>
          </div>
        </div>
      )}

      {tab === "announcements" && (
        <div className="max-w-2xl space-y-4">
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Post an update to followers</h2>
            <textarea value={postBody} onChange={(e) => setPostBody(e.target.value)} rows={3} placeholder="Share a schedule change, announcement, or update" className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
            <button onClick={publishPost} className="focus-ring mt-2 rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
              Post to followers
            </button>
          </div>
          {posts.length > 0 && (
            <div className="space-y-2">
              {posts.map((p) => (
                <div key={p.id} className="rounded-lg border border-surface-border bg-surface-panel p-4 text-sm text-ink-muted">
                  {p.body}
                  <p className="mt-1 text-xs text-ink-faint">{formatRelativeTime(p.postedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "schedule" && (
        <div className="max-w-2xl space-y-4">
          <form onSubmit={addScheduleEntry} className="flex flex-wrap items-end gap-2 rounded-lg border border-surface-border bg-surface-panel p-4">
            <label className="flex-1 min-w-40">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
              <input value={newEntry.title} onChange={(e) => setNewEntry((s) => ({ ...s, title: e.target.value }))} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none" />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-ink-muted">Starts</span>
              <input type="datetime-local" value={newEntry.startsAt} onChange={(e) => setNewEntry((s) => ({ ...s, startsAt: e.target.value }))} className="focus-ring rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none" />
            </label>
            <button type="submit" className="focus-ring rounded-md bg-brand-magenta px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-magenta/90">
              Add
            </button>
          </form>
          <div className="space-y-2">
            {schedule.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-panel p-3.5">
                <div>
                  <p className="text-sm font-medium text-ink">{s.title}</p>
                  <p className="text-xs text-ink-faint">{formatScheduleTime(s.startsAt)}</p>
                </div>
                <button onClick={() => cancelScheduleEntry(s.id)} className="focus-ring rounded-md border border-surface-border px-2.5 py-1 text-xs text-ink-muted hover:text-brand-red">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(unbanTarget)}
        title="Unban this user?"
        description="They'll be able to view and chat in your channel again immediately."
        confirmLabel="Unban"
        onConfirm={() => {
          setBanned((prev) => prev.filter((b) => b.id !== unbanTarget));
          push({ kind: "success", title: "User unbanned" });
          setUnbanTarget(null);
        }}
        onCancel={() => setUnbanTarget(null)}
      />
    </div>
  );
}
