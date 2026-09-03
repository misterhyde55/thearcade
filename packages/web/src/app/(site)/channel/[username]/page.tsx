"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CheckCircle2, Clock, ExternalLink, Play } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Badge";
import { FollowButton } from "@/components/stream/FollowButton";
import { SubscribeModal } from "@/components/monetization/SubscribeModal";
import { useDemoSession } from "@/lib/demo-session";
import { formatCount, formatCurrency, formatDuration, formatRelativeTime, formatScheduleTime } from "@/lib/format";
import { getClipsByCreatorId, getCreatorByUsername, getStreamByCreatorId, getVodsByCreatorId } from "@/lib/mock-data";

type Tab = "home" | "schedule" | "videos" | "clips" | "about";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "schedule", label: "Schedule" },
  { id: "videos", label: "Videos" },
  { id: "clips", label: "Clips" },
  { id: "about", label: "About" }
];

export default function ChannelPage() {
  const params = useParams<{ username: string }>();
  const creator = getCreatorByUsername(params.username);
  const [tab, setTab] = useState<Tab>("home");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const { isSubscribedTo, creator: sessionCreator } = useDemoSession();

  if (!creator) return notFound();
  const stream = getStreamByCreatorId(creator.id);
  const vods = getVodsByCreatorId(creator.id);
  const clips = getClipsByCreatorId(creator.id);
  const subscribed = isSubscribedTo(creator.username);
  const isOwner = sessionCreator?.id === creator.id;

  return (
    <div>
      <div className="relative h-36 w-full sm:h-48" style={{ background: `linear-gradient(120deg, ${creator.bannerAccent[0]}, ${creator.bannerAccent[1]})` }}>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-3">
            <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={88} ring />
            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-semibold text-ink">{creator.displayName}</h1>
                {creator.verified && <CheckCircle2 size={16} className="text-brand-cyan" aria-label="Verified creator" />}
              </div>
              <p className="text-sm text-ink-faint">
                {formatCount(creator.followerCount)} followers · {formatCount(creator.subscriberCount)} subscribers
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            <FollowButton username={creator.username} />
            <button
              onClick={() => setSubscribeOpen(true)}
              className={`focus-ring rounded-md px-3.5 py-2 text-sm font-semibold ${
                subscribed ? "border border-brand-purple/40 bg-brand-purple/10 text-brand-purple" : "bg-brand-purple text-white hover:bg-brand-purple/90"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Pill tone="brand">{creator.category}</Pill>
          {creator.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
          {creator.socialLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center gap-1 rounded-md border border-surface-border px-2.5 py-1 text-xs text-ink-muted hover:text-ink"
            >
              {l.label} <ExternalLink size={11} />
            </a>
          ))}
        </div>

        {stream && (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
            <VideoPlayer
              stream={stream}
              creator={creator}
              theaterMode={false}
              onToggleTheater={() => undefined}
              onRequestSubscribe={() => setSubscribeOpen(true)}
            />
            {stream.status === "live" && (
              <div className="h-[420px] lg:h-auto">
                <ChatPanel channelUsername={creator.username} viewerCount={stream.viewerCount} />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-surface-border" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`focus-ring shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium ${
                tab === t.id ? "border-brand-magenta text-ink" : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "home" && (
            <div className="space-y-6">
              {creator.communityPosts.length > 0 && (
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-ink">Community posts</h2>
                  <div className="space-y-3">
                    {creator.communityPosts.map((p) => (
                      <div key={p.id} className="rounded-lg border border-surface-border bg-surface-panel p-4">
                        <div className="flex items-center gap-2">
                          <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={28} />
                          <span className="text-sm font-medium text-ink">{creator.displayName}</span>
                          <span className="text-xs text-ink-faint">· {formatRelativeTime(p.postedAt)}</span>
                        </div>
                        <p className="mt-2 text-sm text-ink-muted">{p.body}</p>
                        <p className="mt-2 text-xs text-ink-faint">
                          {p.likeCount.toLocaleString()} likes · {p.commentCount.toLocaleString()} comments
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <VodGrid title="Recent broadcasts" vods={vods.slice(0, 3)} />
              <SubscriberBenefits creator={creator} onSubscribeClick={() => setSubscribeOpen(true)} />
            </div>
          )}

          {tab === "schedule" && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-ink">Upcoming schedule</h2>
              {creator.schedule.length === 0 ? (
                <p className="text-sm text-ink-muted">No upcoming streams scheduled yet.</p>
              ) : (
                <div className="space-y-2">
                  {creator.schedule.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-panel p-3.5">
                      <div>
                        <p className="text-sm font-medium text-ink">{s.title}</p>
                        <p className="mt-0.5 text-xs text-ink-faint">{s.category}</p>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Clock size={13} /> {formatScheduleTime(s.startsAt)} · {formatDuration(s.durationMinutes)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "videos" && <VodGrid title="Videos" vods={vods} />}

          {tab === "clips" && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-ink">Clips</h2>
              {clips.length === 0 ? (
                <p className="text-sm text-ink-muted">No clips yet — clips created by viewers will show up here.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {clips.map((c) => (
                    <div key={c.id} className="overflow-hidden rounded-lg border border-surface-border bg-surface-panel">
                      <div
                        className="relative flex aspect-video items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${c.thumbnailAccent[0]}30, ${c.thumbnailAccent[1]}20)` }}
                      >
                        <Play size={20} className="text-ink/70" />
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-ink">{c.durationSeconds}s</span>
                      </div>
                      <div className="p-2.5">
                        <p className="truncate text-xs font-medium text-ink">{c.title}</p>
                        <p className="mt-0.5 text-[11px] text-ink-faint">
                          by {c.clippedByUsername} · {formatCount(c.viewCount)} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "about" && (
            <section className="max-w-2xl space-y-4">
              <div>
                <h2 className="mb-1 text-sm font-semibold text-ink">About {creator.displayName}</h2>
                <p className="text-sm text-ink-muted">{creator.bio}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-ink-faint">Language</dt>
                  <dd className="text-ink">{creator.language}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Joined</dt>
                  <dd className="text-ink">{new Date(creator.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Average retention</dt>
                  <dd className="text-ink">{creator.avgRetentionPct}% of session</dd>
                </div>
              </dl>
            </section>
          )}
        </div>

        {isOwner && (
          <div className="mb-8 rounded-lg border border-brand-cyan/30 bg-brand-cyan/[0.06] p-4 text-sm text-ink-muted">
            You&apos;re viewing your own channel. Manage color, title, and category from the{" "}
            <Link href="/dashboard/stream-manager" className="text-brand-cyan underline">
              Stream Manager
            </Link>
            .
          </div>
        )}
      </div>

      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} creator={creator} />
    </div>
  );
}

function VodGrid({ title, vods }: { title: string; vods: ReturnType<typeof getVodsByCreatorId> }) {
  if (vods.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
        <p className="text-sm text-ink-muted">No videos published yet.</p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vods.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-surface-border bg-surface-panel">
            <div
              className="relative flex aspect-video items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${v.thumbnailAccent[0]}30, ${v.thumbnailAccent[1]}20)` }}
            >
              <Play size={22} className="text-ink/70" />
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-ink">{formatDuration(v.durationMinutes)}</span>
              {v.visibility === "subscribers" && (
                <span className="absolute left-1.5 top-1.5 rounded bg-brand-purple/80 px-1.5 py-0.5 text-[10px] font-medium text-white">Subscribers</span>
              )}
            </div>
            <div className="p-2.5">
              <p className="truncate text-xs font-medium text-ink">{v.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-faint">{formatCount(v.viewCount)} views</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscriberBenefits({ creator, onSubscribeClick }: { creator: NonNullable<ReturnType<typeof getCreatorByUsername>>; onSubscribeClick: () => void }) {
  if (creator.subscriptionTiers.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-ink">Subscriber benefits</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {creator.subscriptionTiers.map((tier) => (
          <div key={tier.id} className="rounded-lg border border-surface-border bg-surface-panel p-4">
            <p className="text-sm font-semibold text-ink">{tier.name}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{formatCurrency(tier.priceMonthly)}/mo</p>
            <ul className="mt-2 space-y-1">
              {tier.perks.map((p) => (
                <li key={p} className="text-xs text-ink-muted">
                  · {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={onSubscribeClick} className="focus-ring mt-3 rounded-md bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple/90">
        Subscribe
      </button>
    </section>
  );
}
