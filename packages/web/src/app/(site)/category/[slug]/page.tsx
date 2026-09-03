"use client";

import { notFound, useParams } from "next/navigation";
import { StreamCard } from "@/components/stream/StreamCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Radio } from "lucide-react";
import { getCategoryBySlug, getStreamsByCategorySlug } from "@/lib/mock-data";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const category = getCategoryBySlug(params.slug);

  if (!category) return notFound();

  const streams = getStreamsByCategorySlug(params.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">{category.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
        <p className="mt-1 text-xs text-ink-faint">
          {category.liveChannelCount} channels live · {category.totalViewers.toLocaleString()} viewers across the category
        </p>
      </div>
      {streams.length === 0 ? (
        <EmptyState icon={Radio} title="No channels live in this category right now" description="Check back soon, or browse other categories." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {streams.map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </div>
      )}
    </div>
  );
}
