"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CheckCircle2, ChevronDown, Clapperboard, Flag, Play } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Badge";
import { FollowButton } from "@/components/stream/FollowButton";
import { ShareButton } from "@/components/stream/ShareButton";
import { ReportModal } from "@/components/stream/ReportModal";
import { StreamCard } from "@/components/stream/StreamCard";
import { SubscribeModal } from "@/components/monetization/SubscribeModal";
import { useToast } from "@/components/ui/Toast";
import { useDemoSession } from "@/lib/demo-session";
import { formatCount, formatDuration, formatUptime } from "@/lib/format";
import { getCreatorById, getLiveStreams, getStreamById, getVodsByCreatorId } from "@/lib/mock-data";

export default function WatchPage() {
  const params = useParams<{ streamId: string }>();
  const stream = getStreamById(params.streamId);
  const [theaterMode, setTheaterMode] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const { isSubscribedTo } = useDemoSession();
  const { push } = useToast();

  if (!stream) return notFound();
  const creator = getCreatorById(stream.creatorId);
  if (!creator) return notFound();

  const vods = getVodsByCreatorId(creator.id);
  const suggested = getLiveStreams().filter((s) => s.id !== stream.id).slice(0, 4);
  const subscribed = isSubscribedTo(creator.username);

  function createClip() {
    push({ kind: "success", title: "Clip created", description: "Saved to your Clips in the dashboard content library." });
  }

  return (
    <div className={`mx-auto px-4 py-5 sm:px-6 lg:px-8 ${theaterMode ? "max-w-[1600px]" : "max-w-7xl"}`}>
      <div className={`grid grid-cols-1 gap-4 ${theaterMode ? "xl:grid-cols-[1fr_360px]" : "lg:grid-cols-[1fr_340px]"}`}>
        <div>
          <VideoPlayer
            stream={stream}
            creator={creator}
            theaterMode={theaterMode}
            onToggleTheater={() => setTheaterMode((v) => !v)}
            onRequestSubscribe={() => setSubscribeOpen(true)}
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <Link href={`/channel/${creator.username}`}>
                <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={48} />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-ink">{stream.title}</h1>
                <Link href={`/channel/${creator.username}`} className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                  {creator.displayName}
                  {creator.verified && <CheckCircle2 size={13} className="text-brand-cyan" />}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Pill tone="brand">{stream.category}</Pill>
                  {stream.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-faint">
                  {formatCount(stream.viewerCount)} watching · live for {formatUptime(stream.startedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <FollowButton username={creator.username} />
              <button
                onClick={() => setSubscribeOpen(true)}
                className={`focus-ring rounded-md px-3.5 py-2 text-sm font-semibold ${
                  subscribed ? "border border-brand-purple/40 bg-brand-purple/10 text-brand-purple" : "bg-brand-purple text-white hover:bg-brand-purple/90"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
              <button onClick={createClip} className="focus-ring flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-2 text-sm text-ink-muted hover:text-ink">
                <Clapperboard size={15} /> Clip
              </button>
              <ShareButton url={`/watch/${stream.id}`} />
              <button onClick={() => setReportOpen(true)} className="focus-ring flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-2 text-sm text-ink-muted hover:text-brand-red">
                <Flag size={15} /> Report
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-surface-border bg-surface-panel p-4">
            <button onClick={() => setDescriptionOpen((v) => !v)} aria-expanded={descriptionOpen} className="focus-ring flex w-full items-center justify-between text-left">
              <span className="text-sm font-medium text-ink">About this stream</span>
              <ChevronDown size={16} className={`text-ink-faint transition-transform ${descriptionOpen ? "rotate-180" : ""}`} />
            </button>
            {descriptionOpen && <p className="mt-2 text-sm text-ink-muted">{creator.bio}</p>}
          </div>

          {vods.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-ink">More from {creator.displayName}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {vods.slice(0, 3).map((v) => (
                  <Link
                    key={v.id}
                    href={`/channel/${creator.username}`}
                    className="focus-ring block overflow-hidden rounded-lg border border-surface-border bg-surface-panel"
                  >
                    <div
                      className="relative flex aspect-video items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${v.thumbnailAccent[0]}30, ${v.thumbnailAccent[1]}20)` }}
                    >
                      <Play size={22} className="text-ink/70" />
                      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-ink">{formatDuration(v.durationMinutes)}</span>
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-medium text-ink">{v.title}</p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">{formatCount(v.viewCount)} views</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {suggested.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-ink">Suggested live channels</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {suggested.map((s) => (
                  <StreamCard key={s.id} stream={s} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="h-[520px] lg:h-[calc(100vh-9rem)] lg:sticky lg:top-20">
          <ChatPanel channelUsername={creator.username} viewerCount={stream.viewerCount} />
        </div>
      </div>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} targetLabel={`${creator.displayName}'s stream`} />
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} creator={creator} />
    </div>
  );
}
