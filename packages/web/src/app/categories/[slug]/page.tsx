"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { StreamCardData } from "@/lib/types";
import { StreamCard } from "@/components/StreamCard";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const [streams, setStreams] = useState<StreamCardData[] | null>(null);

  useEffect(() => {
    api<{ streams: StreamCardData[] }>(`/api/streams/live?category=${params.slug}`)
      .then((data) => setStreams(data.streams))
      .catch(() => setStreams([]));
  }, [params.slug]);

  return (
    <div>
      <h1 className="mb-4 font-pixel text-lg text-neon-cyan">{params.slug.replace(/-/g, " ").toUpperCase()}</h1>
      {streams?.length === 0 && (
        <p className="font-mono text-sm text-arcade-cyan/60">No cabinets lit up in this category right now.</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {streams?.map((s) => (
          <StreamCard key={s.id} stream={s} />
        ))}
      </div>
    </div>
  );
}
