"use client";

import { Lightbulb, Play } from "lucide-react";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { useDemoSession } from "@/lib/demo-session";
import { formatCount, formatCurrency, formatDuration } from "@/lib/format";
import { ANALYTICS, getClipsByCreatorId } from "@/lib/mock-data";

const INSIGHTS = [
  "More viewers stayed after you switched from Gaming to Anime & Manga last Tuesday.",
  "Your returning-viewer rate is up this week compared to your usual average.",
  "Most new viewers this week found you through Hidden Gems on the homepage.",
  "Viewership dipped in the first 10 minutes of your last stream — a common pattern before the main segment starts, not a red flag."
];

export default function AnalyticsPage() {
  const { creator } = useDemoSession();
  if (!creator) return null;

  const clips = getClipsByCreatorId(creator.id);
  const maxHistory = Math.max(...ANALYTICS.viewerHistory30d.map((p) => p.value));
  const maxRetention = 100;

  return (
    <div className="space-y-6">
      <div>
        <SectionKicker>WHAT HAPPENED, WHAT&apos;S NEXT</SectionKicker>
        <h1 className="text-xl font-semibold text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">Last 30 days, in plain terms — not a raw data dump.</p>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Lightbulb size={15} className="text-brand-cyan" /> What this means for you
        </h2>
        <ul className="space-y-2">
          {INSIGHTS.map((line) => (
            <li key={line} className="rounded-md border border-brand-cyan/20 bg-brand-cyan/[0.04] px-3 py-2 text-sm text-ink-muted">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Avg. concurrent viewers" value={formatCount(ANALYTICS.avgConcurrentViewers)} />
        <Stat label="Peak viewers" value={formatCount(ANALYTICS.peakViewers)} />
        <Stat label="Unique viewers" value={formatCount(ANALYTICS.uniqueViewers)} />
        <Stat label="Total watch time" value={`${formatCount(ANALYTICS.watchTimeHours)} hrs`} />
        <Stat label="Follower growth" value={`+${ANALYTICS.followerGrowth30d}%`} accent="cyan" />
        <Stat label="Subscriber growth" value={`+${ANALYTICS.subscriberGrowth30d}%`} accent="cyan" />
        <Stat label="Est. revenue" value={formatCurrency(ANALYTICS.estimatedRevenue30d)} accent="magenta" />
        <Stat label="Chat messages / hr" value={formatCount(ANALYTICS.chatMessagesPerHour)} />
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink">Viewers over the last 14 days</h2>
        <p className="mb-4 text-xs text-ink-faint">Daily average concurrent viewers.</p>
        <div className="flex h-40 items-end gap-1.5">
          {ANALYTICS.viewerHistory30d.map((p) => (
            <div key={p.label} className="group relative flex-1">
              <div
                className="w-full rounded-t bg-brand-magenta/70 transition group-hover:bg-brand-magenta"
                style={{ height: `${Math.max(4, (p.value / maxHistory) * 100)}%` }}
              />
              <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                {formatCount(p.value)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink">Viewer retention</h2>
          <p className="mb-4 text-xs text-ink-faint">Percentage of viewers still watching at each point in an average session.</p>
          <div className="space-y-2">
            {ANALYTICS.retentionCurve.map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-xs text-ink-faint">{p.label}</span>
                <div className="h-2.5 flex-1 rounded-full bg-surface-panel2">
                  <div className="h-full rounded-full bg-brand-cyan" style={{ width: `${(p.value / maxRetention) * 100}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-xs text-ink-muted">{p.value}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink">Where viewers find you</h2>
          <p className="mb-4 text-xs text-ink-faint">Discovery source breakdown.</p>
          <div className="space-y-2">
            {ANALYTICS.discoverySources.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-32 shrink-0 truncate text-xs text-ink-muted">{s.label}</span>
                <div className="h-2.5 flex-1 rounded-full bg-surface-panel2">
                  <div className="h-full rounded-full bg-brand-purple" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-xs text-ink-muted">{s.pct}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink">Device breakdown</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          {ANALYTICS.deviceBreakdown.map((d) => (
            <div key={d.label} className="min-w-24">
              <p className="text-lg font-semibold text-ink">{d.pct}%</p>
              <p className="text-xs text-ink-faint">{d.label}</p>
            </div>
          ))}
        </div>
      </section>

      {clips.length > 0 && (
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Play size={15} /> Clip performance
          </h2>
          <div className="space-y-1.5">
            {clips.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-ink-muted">
                  {c.title} <span className="text-ink-faint">by {c.clippedByUsername}</span>
                </span>
                <span className="shrink-0 font-medium text-ink">{formatCount(c.viewCount)} views</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Stream-by-stream comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="py-2">Stream</th>
                <th className="py-2">Date</th>
                <th className="py-2">Avg. viewers</th>
                <th className="py-2">Peak</th>
                <th className="py-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {ANALYTICS.streamComparison.map((s) => (
                <tr key={s.title}>
                  <td className="py-2.5 text-ink">{s.title}</td>
                  <td className="py-2.5 text-ink-muted">{s.date}</td>
                  <td className="py-2.5 text-ink-muted">{formatCount(s.avgViewers)}</td>
                  <td className="py-2.5 text-ink-muted">{formatCount(s.peakViewers)}</td>
                  <td className="py-2.5 text-ink-muted">{formatDuration(s.durationMinutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "cyan" | "magenta" }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-panel p-4">
      <p className={`text-lg font-semibold ${accent === "cyan" ? "text-brand-cyan" : accent === "magenta" ? "text-brand-magenta" : "text-ink"}`}>{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}
