import Link from "next/link";
import { Play } from "lucide-react";
import { VODS, WATCH_HISTORY, getCreatorById } from "@/lib/mock-data";
import { formatDuration } from "@/lib/format";

export function ContinueWatchingRow() {
  const items = WATCH_HISTORY.map((h) => ({ history: h, vod: VODS.find((v) => v.id === h.vodId) })).filter(
    (i): i is { history: (typeof WATCH_HISTORY)[number]; vod: NonNullable<(typeof VODS)[number]> } => Boolean(i.vod)
  );

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-ink">Continue watching</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ history, vod }) => {
          const creator = getCreatorById(vod.creatorId);
          return (
            <Link
              key={vod.id}
              href={`/channel/${creator?.username ?? ""}`}
              className="focus-ring group block overflow-hidden rounded-lg border border-surface-border bg-surface-panel"
            >
              <div
                className="relative flex aspect-video items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${vod.thumbnailAccent[0]}33, ${vod.thumbnailAccent[1]}22)` }}
              >
                <Play size={28} className="text-ink/70" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
                  <div className="h-full bg-brand-red" style={{ width: `${history.progressPct}%` }} />
                </div>
                <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-ink">
                  {formatDuration(vod.durationMinutes)}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink group-hover:text-brand-cyan">{vod.title}</p>
                <p className="mt-1 text-xs text-ink-faint">{creator?.displayName} · {history.progressPct}% watched</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
