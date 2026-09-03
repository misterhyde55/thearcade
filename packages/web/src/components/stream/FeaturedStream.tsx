"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Badge";
import { CabinetFrame } from "@/components/player/CabinetFrame";
import { FollowButton } from "@/components/stream/FollowButton";
import { formatCount, formatUptime } from "@/lib/format";
import { getCreatorById } from "@/lib/mock-data";
import type { Stream } from "@/lib/types";

export function FeaturedStream({ stream }: { stream: Stream }) {
  const [muted, setMuted] = useState(true);
  const creator = getCreatorById(stream.creatorId);
  if (!creator) return null;

  return (
    <section aria-label="Featured live broadcast" className="overflow-hidden rounded-xl border border-surface-border bg-surface-panel">
      <div className="grid grid-cols-1 gap-0 p-3 lg:grid-cols-[1fr_320px] lg:gap-4 lg:p-4">
        <CabinetFrame>
          <Link
            href={`/watch/${stream.id}`}
            className="focus-ring screen-vignette group relative block aspect-video overflow-hidden rounded-lg border border-black/60"
            style={{ background: `linear-gradient(135deg, ${stream.thumbnailAccent[0]}40, ${stream.thumbnailAccent[1]}25)` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={88} />
            </div>
            <span className="cabinet-light absolute left-3 top-3 flex items-center gap-1.5 rounded bg-brand-red px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
            </span>
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-medium text-ink">
              <Users size={13} /> {formatCount(stream.viewerCount)} players watching
            </span>
            <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-xs text-ink-muted">
              Simulated preview · uptime {formatUptime(stream.startedAt)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setMuted((v) => !v);
              }}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute preview" : "Mute preview"}
              className="focus-ring absolute bottom-3 right-3 rounded-full bg-black/70 p-2 text-ink hover:bg-black/85"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="screen-scanlines pointer-events-none absolute inset-0" aria-hidden />
          </Link>
        </CabinetFrame>

        <div className="flex flex-col justify-between gap-4 p-2 lg:p-1">
          <div>
            <div className="flex items-center gap-2">
              <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={36} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{creator.displayName}</p>
                <p className="truncate text-xs text-ink-faint">{creator.followerCount.toLocaleString()} followers</p>
              </div>
            </div>
            <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-ink">{stream.title}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="brand">{stream.category}</Pill>
              {stream.tags.slice(0, 3).map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FollowButton username={creator.username} className="flex-1" />
            <Link
              href={`/watch/${stream.id}`}
              className="arcade-button focus-ring flex-1 rounded-md bg-brand-magenta px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-magenta/90"
            >
              Watch now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
