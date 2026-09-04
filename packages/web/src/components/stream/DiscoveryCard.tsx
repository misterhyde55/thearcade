import Link from "next/link";
import { Compass, Heart, Moon, Radio, Repeat, Sparkles, TrendingUp, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";
import { getCreatorById, getStreamByCreatorId } from "@/lib/mock-data";
import type { DiscoveryEntry, DiscoveryReasonIcon } from "@/lib/types";

const REASON_ICONS: Record<DiscoveryReasonIcon, typeof Sparkles> = {
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  users: Users,
  radio: Radio,
  heart: Heart,
  moon: Moon,
  compass: Compass,
  repeat: Repeat
};

export function DiscoveryCard({ entry }: { entry: DiscoveryEntry }) {
  const creator = getCreatorById(entry.creatorId);
  if (!creator) return null;
  const stream = getStreamByCreatorId(creator.id);
  const isLive = stream?.status === "live";
  const Icon = REASON_ICONS[entry.icon];
  const href = isLive ? `/watch/${stream!.id}` : `/channel/${creator.username}`;
  const accent = stream?.thumbnailAccent ?? creator.bannerAccent;

  return (
    <Link
      href={href}
      className="focus-ring group block overflow-hidden rounded-lg border border-surface-border bg-surface-panel transition hover:border-surface-borderStrong"
    >
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${accent[0]}33, ${accent[1]}22)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
        <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={48} />
        {isLive ? (
          <span className="cabinet-light absolute left-2 top-2 flex items-center gap-1 rounded bg-brand-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
          </span>
        ) : (
          <span className="absolute left-2 top-2 rounded bg-surface-panel2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            Offline
          </span>
        )}
        {isLive && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-ink">
            <Users size={11} /> {formatCount(stream!.viewerCount)} players
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: creator.avatarColor }} />
          <span className="truncate text-sm font-medium text-ink group-hover:text-brand-cyan">{creator.displayName}</span>
        </div>
        <div className="mt-1.5">
          <Pill tone="brand">{creator.category}</Pill>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-brand-cyan">
          <Icon size={13} className="mt-0.5 shrink-0" />
          {entry.reason}
        </p>
      </div>
    </Link>
  );
}
