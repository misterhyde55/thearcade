import Link from "next/link";
import { Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";
import { getCreatorById } from "@/lib/mock-data";
import type { Stream } from "@/lib/types";

export function StreamCard({ stream }: { stream: Stream }) {
  const creator = getCreatorById(stream.creatorId);
  if (!creator) return null;

  return (
    <Link
      href={`/watch/${stream.id}`}
      className="focus-ring group block overflow-hidden rounded-lg border border-surface-border bg-surface-panel transition hover:border-surface-borderStrong"
    >
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${stream.thumbnailAccent[0]}33, ${stream.thumbnailAccent[1]}22)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
        <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={52} />
        {stream.status === "live" && (
          <span className="cabinet-light absolute left-2 top-2 flex items-center gap-1 rounded bg-brand-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
          </span>
        )}
        {stream.status === "starting_soon" && (
          <span className="absolute left-2 top-2 rounded bg-brand-purple px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Starting soon
          </span>
        )}
        {stream.status === "offline" && (
          <span className="absolute left-2 top-2 rounded bg-surface-panel2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            Offline
          </span>
        )}
        {stream.subscriberOnly && (
          <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-ink">
            Subscribers
          </span>
        )}
        {stream.status === "live" && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-ink">
            <Users size={11} /> {formatCount(stream.viewerCount)} players
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-ink group-hover:text-brand-cyan">{stream.title}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={18} />
          <span className="truncate text-xs text-ink-muted">{creator.displayName}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Pill tone="brand">{stream.category}</Pill>
          {stream.tags.slice(0, 2).map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
    </Link>
  );
}
