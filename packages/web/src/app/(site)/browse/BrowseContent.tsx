"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { StreamCard } from "@/components/stream/StreamCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDemoSession } from "@/lib/demo-session";
import { CATEGORIES, getAllChannelEntries } from "@/lib/mock-data";
import type { Stream } from "@/lib/types";

type SortMode = "recommended" | "viewers" | "recent" | "small" | "new";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "viewers", label: "Highest viewers" },
  { id: "recent", label: "Recently started" },
  { id: "small", label: "Small communities" },
  { id: "new", label: "New creators" }
];

const LANGUAGES = ["Any language", "English"];

export function BrowseContent() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const { isSignedIn, followedUsernames } = useDemoSession();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortMode>("recommended");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [matureAllowed, setMatureAllowed] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "offline">("all");
  const [followedOnly, setFollowedOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const entries = useMemo(() => {
    let items = getAllChannelEntries();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (e) =>
          e.creator.displayName.toLowerCase().includes(q) ||
          e.creator.username.toLowerCase().includes(q) ||
          e.stream.title.toLowerCase().includes(q) ||
          e.stream.category.toLowerCase().includes(q) ||
          e.stream.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "all") {
      items = items.filter((e) => e.creator.category === categoryFilter);
    }
    if (language !== "Any language") {
      items = items.filter((e) => e.stream.language === language);
    }
    if (!matureAllowed) {
      items = items.filter((e) => !e.stream.matureContent);
    }
    if (statusFilter === "live") {
      items = items.filter((e) => e.stream.status === "live" || e.stream.status === "starting_soon");
    }
    if (statusFilter === "offline") {
      items = items.filter((e) => e.stream.status === "offline");
    }
    if (followedOnly) {
      items = items.filter((e) => followedUsernames.includes(e.creator.username));
    }

    switch (sort) {
      case "viewers":
        items = [...items].sort((a, b) => b.stream.viewerCount - a.stream.viewerCount);
        break;
      case "recent":
        items = [...items].sort((a, b) => {
          const at = a.stream.startedAt ? new Date(a.stream.startedAt).getTime() : 0;
          const bt = b.stream.startedAt ? new Date(b.stream.startedAt).getTime() : 0;
          return bt - at;
        });
        break;
      case "small":
        items = [...items].sort((a, b) => a.creator.followerCount - b.creator.followerCount);
        break;
      case "new":
        items = [...items].sort((a, b) => new Date(b.creator.createdAt).getTime() - new Date(a.creator.createdAt).getTime());
        break;
      default:
        items = [...items].sort((a, b) => {
          const score = (e: (typeof items)[number]) =>
            e.stream.viewerCount * 0.4 + e.creator.growthRate30d * 30 + e.creator.avgRetentionPct * 10;
          return score(b) - score(a);
        });
    }

    return items;
  }, [query, sort, language, matureAllowed, statusFilter, followedOnly, categoryFilter, followedUsernames]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-ink">Browse</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search creators, titles, categories, tags…"
          aria-label="Search"
          className="focus-ring w-full rounded-md border border-surface-border bg-surface-panel px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint sm:w-80"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-surface-border bg-surface-panel p-3">
        <Filter size={15} className="mr-1 shrink-0 text-ink-faint" aria-hidden />
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSort(opt.id)}
            aria-pressed={sort === opt.id}
            className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-medium ${
              sort === opt.id
                ? "border-brand-magenta bg-brand-magenta/15 text-brand-magenta"
                : "border-surface-border text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-surface-border" aria-hidden />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Category"
          className="focus-ring rounded-full border border-surface-border bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language"
          className="focus-ring rounded-full border border-surface-border bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Live or offline status"
          className="focus-ring rounded-full border border-surface-border bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
        >
          <option value="all">Live or offline</option>
          <option value="live">Live now</option>
          <option value="offline">Offline channels</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs text-ink-muted">
          <input type="checkbox" checked={matureAllowed} onChange={(e) => setMatureAllowed(e.target.checked)} className="accent-brand-magenta" />
          Show mature content
        </label>

        {isSignedIn && (
          <label className="flex items-center gap-1.5 text-xs text-ink-muted">
            <input type="checkbox" checked={followedOnly} onChange={(e) => setFollowedOnly(e.target.checked)} className="accent-brand-magenta" />
            Followed channels only
          </label>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No channels match these filters"
          description="Try clearing a filter or searching a different term."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map((e) => (
            <StreamCard key={e.stream.id} stream={e.stream as Stream} />
          ))}
        </div>
      )}
    </div>
  );
}
