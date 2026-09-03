"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category, StreamCardData } from "@/lib/types";
import { StreamCard } from "@/components/StreamCard";

export default function HomePage() {
  const [streams, setStreams] = useState<StreamCardData[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api<{ streams: StreamCardData[] }>("/api/streams/live")
      .then((data) => setStreams(data.streams))
      .catch(() => setStreams([]));
    api<{ categories: Category[] }>("/api/categories")
      .then((data) => setCategories(data.categories))
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-lg border-2 border-arcade-border bg-arcade-panel p-8 text-center shadow-cabinet">
        <p className="font-pixel text-2xl text-neon-yellow sm:text-3xl">HIGH SCORE STREAMING</p>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-lg text-arcade-cyan/80">
          Free, ad-free, low-latency live streaming with a retro arcade soul. No paywalled chat,
          no forced ads — just you, the cabinet, and the crowd.
        </p>
        <p className="mt-2 font-mono text-sm text-arcade-magenta/80">
          Chat and earn XP · Level up as you watch · ~6-8s latency, not 30s
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-pixel text-sm text-neon-cyan">CABINETS</h2>
          <Link href="/categories" className="font-mono text-xs text-arcade-cyan/70 hover:text-neon-cyan">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded border-2 border-arcade-border bg-arcade-panel p-3 text-center hover:border-arcade-yellow"
            >
              <div className="text-2xl">{c.emoji}</div>
              <p className="mt-1 truncate font-mono text-xs text-white">{c.name}</p>
              <p className="font-mono text-[10px] text-arcade-cyan/60">{c.liveCount} live</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-pixel text-sm text-neon-magenta">LIVE NOW</h2>
        {streams === null && <p className="font-mono text-sm text-arcade-cyan/60">Loading cabinets...</p>}
        {streams?.length === 0 && (
          <p className="font-mono text-sm text-arcade-cyan/60">
            Nobody&apos;s live yet. Be the first —{" "}
            <Link href="/register" className="text-neon-cyan underline">
              insert a coin
            </Link>{" "}
            and go live from your dashboard.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {streams?.map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
