"use client";

import { useState } from "react";
import { Bookmark, Megaphone, ShieldAlert, Swords, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useDemoSession } from "@/lib/demo-session";
import { formatUptime } from "@/lib/format";
import { CATEGORIES, MODERATION_CASES, getStreamByCreatorId } from "@/lib/mock-data";

export default function StreamManagerPage() {
  const { creator } = useDemoSession();
  const { push } = useToast();
  if (!creator) return null;
  const stream = getStreamByCreatorId(creator.id);

  const [title, setTitle] = useState(stream?.title ?? "");
  const [category, setCategory] = useState(creator.category);
  const [tags, setTags] = useState(creator.tags.join(", "));
  const [mature, setMature] = useState(stream?.matureContent ?? false);

  const [followersOnly, setFollowersOnly] = useState(false);
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  const [slowMode, setSlowMode] = useState(0);

  const [raidTarget, setRaidTarget] = useState("");
  const [raidConfirmOpen, setRaidConfirmOpen] = useState(false);
  const [adConfirmOpen, setAdConfirmOpen] = useState(false);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [markers, setMarkers] = useState<{ id: string; label: string; at: string }[]>([]);

  const openCases = MODERATION_CASES.filter((c) => c.status === "under_appeal" || c.status === "active");

  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    push({ kind: "success", title: "Stream details updated" });
  }

  function addMarker() {
    setMarkers((prev) => [...prev, { id: `${Date.now()}`, label: `Marker ${prev.length + 1}`, at: formatUptime(stream?.startedAt ?? null) }]);
    push({ kind: "success", title: "Marker created", description: "Viewers and editors can jump to this point in the VOD later." });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">Stream Manager</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-surface-border bg-surface-panel p-4">
          <div
            className="relative flex aspect-video items-center justify-center rounded-md"
            style={{ background: `linear-gradient(135deg, ${creator.bannerAccent[0]}30, ${creator.bannerAccent[1]}20)` }}
          >
            <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={48} />
            {stream?.status === "live" && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-brand-red px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            {stream?.status === "live" ? `Live · uptime ${formatUptime(stream.startedAt)}` : "Not currently broadcasting"}
          </p>
          <button
            onClick={() => setEndConfirmOpen(true)}
            disabled={stream?.status !== "live"}
            className="focus-ring mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-brand-red/40 bg-brand-red/10 py-2 text-xs font-semibold text-brand-red hover:bg-brand-red/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={13} /> End stream
          </button>
        </div>

        <form onSubmit={saveDetails} className="space-y-4 rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="text-sm font-semibold text-ink">Stream details</h2>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
            />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none">
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Tags (comma separated)</span>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={mature} onChange={(e) => setMature(e.target.checked)} className="accent-brand-magenta" />
            Mark this stream as mature content
          </label>
          <button type="submit" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            Save changes
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ShieldAlert size={15} /> Chat modes
          </h2>
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-sm text-ink">
              Followers-only
              <input type="checkbox" checked={followersOnly} onChange={(e) => setFollowersOnly(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between text-sm text-ink">
              Subscribers-only
              <input type="checkbox" checked={subscribersOnly} onChange={(e) => setSubscribersOnly(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <div className="flex items-center justify-between text-sm text-ink">
              Slow mode
              <select value={slowMode} onChange={(e) => setSlowMode(Number(e.target.value))} className="rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-xs">
                <option value={0}>Off</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              setFollowersOnly(true);
              push({ kind: "success", title: "Chat locked to followers-only", description: "One-click safety action applied." });
            }}
            className="mt-3 w-full rounded-md border border-surface-border py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
          >
            One-click followers-only
          </button>
          <button
            onClick={() => {
              setFollowersOnly(true);
              setSubscribersOnly(false);
              setSlowMode(0);
              push({ kind: "warning", title: "Panic mode engaged", description: "Chat locked to followers-only. Notify a moderator to investigate." });
            }}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-brand-red/40 bg-brand-red/10 py-1.5 text-xs font-semibold text-brand-red hover:bg-brand-red/20"
          >
            <ShieldAlert size={13} /> Panic button
          </button>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Live tools</h2>
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <input
                value={raidTarget}
                onChange={(e) => setRaidTarget(e.target.value)}
                placeholder="Channel to raid"
                className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none"
              />
              <button
                onClick={() => raidTarget.trim() && setRaidConfirmOpen(true)}
                disabled={!raidTarget.trim()}
                className="focus-ring flex items-center gap-1 rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-surface disabled:opacity-40"
              >
                <Swords size={13} /> Raid
              </button>
            </div>
            <button onClick={addMarker} className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md border border-surface-border py-2 text-xs font-medium text-ink-muted hover:text-ink">
              <Bookmark size={13} /> Create marker
            </button>
            <button onClick={() => setAdConfirmOpen(true)} className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md border border-surface-border py-2 text-xs font-medium text-ink-muted hover:text-ink">
              <Megaphone size={13} /> Run advertisement
            </button>
          </div>
          {markers.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-surface-border pt-3">
              {markers.map((m) => (
                <li key={m.id} className="text-xs text-ink-muted">
                  {m.label} · {m.at}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Moderation queue</h2>
          {openCases.length === 0 ? (
            <p className="text-sm text-ink-muted">Nothing needs review right now.</p>
          ) : (
            <ul className="space-y-2">
              {openCases.map((c) => (
                <li key={c.id} className="rounded-md border border-surface-border px-3 py-2 text-xs">
                  <p className="font-medium text-ink">{c.ruleLabel}</p>
                  <p className="mt-0.5 text-ink-faint">{c.status.replace("_", " ")}</p>
                </li>
              ))}
            </ul>
          )}
          <a href="/dashboard/moderation" className="focus-ring mt-3 inline-block text-xs text-brand-cyan hover:underline">
            Open Moderation & Safety →
          </a>
        </section>
      </div>

      <ConfirmDialog
        open={raidConfirmOpen}
        title={`Raid ${raidTarget}?`}
        description={`Your current viewers will be redirected to ${raidTarget}'s channel when the raid starts.`}
        confirmLabel="Start raid"
        onConfirm={() => {
          push({ kind: "success", title: `Raid started to ${raidTarget}`, description: "Your viewers are being redirected now." });
          setRaidConfirmOpen(false);
          setRaidTarget("");
        }}
        onCancel={() => setRaidConfirmOpen(false)}
      />
      <ConfirmDialog
        open={adConfirmOpen}
        title="Run a 90-second advertisement?"
        description="Viewers will see an ad break. Ad revenue for this break follows the same creator-first split as subscriptions."
        confirmLabel="Run ad"
        onConfirm={() => {
          push({ kind: "success", title: "Ad break started", description: "90-second advertisement running for viewers now." });
          setAdConfirmOpen(false);
        }}
        onCancel={() => setAdConfirmOpen(false)}
      />
      <ConfirmDialog
        open={endConfirmOpen}
        title="End your stream?"
        description="This will stop your broadcast for all viewers and begin publishing the VOD."
        confirmLabel="End stream"
        destructive
        onConfirm={() => {
          push({ kind: "info", title: "Stream ended", description: "VOD publishing has started." });
          setEndConfirmOpen(false);
        }}
        onCancel={() => setEndConfirmOpen(false)}
      />
    </div>
  );
}
