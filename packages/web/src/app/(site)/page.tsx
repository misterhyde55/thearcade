"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FeaturedStream } from "@/components/stream/FeaturedStream";
import { StreamCard } from "@/components/stream/StreamCard";
import { CreatorDiscoveryCard } from "@/components/stream/CreatorDiscoveryCard";
import { ContinueWatchingRow } from "@/components/stream/ContinueWatchingRow";
import { useDemoSession } from "@/lib/demo-session";
import { CATEGORIES, DISCOVERY_HIGHLIGHTS, getLiveStreams } from "@/lib/mock-data";

export default function HomePage() {
  const { isSignedIn } = useDemoSession();
  const liveStreams = getLiveStreams();
  const [featured, ...rest] = liveStreams;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div aria-hidden className="arcade-grid-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]" />

      {featured && (
        <section className="mb-10">
          <FeaturedStream stream={featured} />
        </section>
      )}

      {isSignedIn && <ContinueWatchingRow />}

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Live now</h2>
          <Link href="/browse" className="focus-ring flex items-center gap-1 text-sm font-medium text-brand-cyan hover:underline">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="focus-ring rounded-lg border border-surface-border bg-surface-panel p-4 transition hover:border-surface-borderStrong"
            >
              <p className="text-sm font-medium text-ink">{c.name}</p>
              <p className="mt-1 text-xs text-ink-faint">{c.liveChannelCount} live now</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles size={17} className="text-brand-purple" />
          <h2 className="text-lg font-semibold text-ink">Creators worth discovering</h2>
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          Surfaced by growth rate, retention, and engagement — not just current viewer count.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVERY_HIGHLIGHTS.map((h) => (
            <CreatorDiscoveryCard key={h.creatorId} creatorId={h.creatorId} reason={h.reason} />
          ))}
        </div>
      </section>
    </div>
  );
}
