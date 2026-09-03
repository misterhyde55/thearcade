"use client";

import Link from "next/link";
import { Activity, CheckCircle2, Circle, Gauge, Radio, TrendingUp, Users } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { formatCount, formatCurrency, formatRelativeTime } from "@/lib/format";
import { ANALYTICS, MODERATORS, NOTIFICATIONS, getStreamByCreatorId } from "@/lib/mock-data";

const CHECKLIST = [
  { label: "Stream title and category set", done: true },
  { label: "Stream key configured in OBS or Streamlabs", done: true },
  { label: "At least one moderator added", done: MODERATORS.length > 0 },
  { label: "Chat rules and automod configured", done: true },
  { label: "Mature-content flag reviewed", done: true }
];

export default function DashboardOverviewPage() {
  const { creator } = useDemoSession();
  if (!creator) return null;
  const stream = getStreamByCreatorId(creator.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Overview</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            Channel status:
            {stream?.status === "live" ? (
              <span className="flex items-center gap-1 font-medium text-brand-red">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-brand-red" /> Live now
              </span>
            ) : (
              <span className="font-medium text-ink-faint">Offline</span>
            )}
          </p>
        </div>
        <Link href="/dashboard/stream-manager" className="focus-ring flex items-center gap-1.5 rounded-md bg-brand-red px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-red/90">
          <Radio size={15} /> Open Stream Manager
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Avg. viewers" value={formatCount(ANALYTICS.avgConcurrentViewers)} />
        <StatCard icon={TrendingUp} label="Followers (30d)" value={`+${ANALYTICS.followerGrowth30d}%`} />
        <StatCard icon={Users} label="Subscribers" value={formatCount(creator.subscriberCount)} />
        <StatCard icon={Gauge} label="Est. revenue (30d)" value={formatCurrency(ANALYTICS.estimatedRevenue30d)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Go Live checklist</h2>
          <ul className="space-y-2">
            {CHECKLIST.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? <CheckCircle2 size={15} className="text-brand-cyan" /> : <Circle size={15} className="text-ink-faint" />}
                <span className={item.done ? "text-ink" : "text-ink-muted"}>{item.label}</span>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/setup" className="focus-ring mt-3 inline-block text-xs text-brand-cyan hover:underline">
            Review stream setup →
          </Link>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Activity size={15} /> Recent activity
          </h2>
          <ul className="space-y-3">
            {NOTIFICATIONS.slice(0, 5).map((n) => (
              <li key={n.id} className="text-sm">
                <p className="text-ink">{n.title}</p>
                <p className="text-xs text-ink-faint">{n.body} · {formatRelativeTime(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Stream health, last broadcast</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat label="Peak viewers" value={formatCount(ANALYTICS.peakViewers)} />
          <MiniStat label="Avg. retention" value={`${creator.avgRetentionPct}%`} />
          <MiniStat label="Chat msgs / hr" value={formatCount(ANALYTICS.chatMessagesPerHour)} />
          <MiniStat label="Dropped frames" value="0.2%" good />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-panel p-4">
      <Icon size={15} className="text-ink-faint" />
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}

function MiniStat({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div>
      <p className={`text-base font-semibold ${good ? "text-brand-cyan" : "text-ink"}`}>{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}
