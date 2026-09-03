"use client";

import { useState } from "react";
import { Download, Pencil, Play, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useDemoSession } from "@/lib/demo-session";
import { formatCount, formatDuration } from "@/lib/format";
import { backendRequiredMessage } from "@/lib/backend-notice";
import { getClipsByCreatorId, getVodsByCreatorId } from "@/lib/mock-data";
import type { VOD } from "@/lib/types";

type Tab = "broadcasts" | "clips";

export default function ContentPage() {
  const { creator } = useDemoSession();
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("broadcasts");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  if (!creator) return null;

  const [vods, setVods] = useState<VOD[]>(() => getVodsByCreatorId(creator.id));
  const clips = getClipsByCreatorId(creator.id);

  function updateVisibility(id: string, visibility: VOD["visibility"]) {
    setVods((prev) => prev.map((v) => (v.id === id ? { ...v, visibility } : v)));
    push({ kind: "success", title: "Visibility updated" });
  }

  function renameVod(id: string) {
    const next = window.prompt("New title");
    if (!next) return;
    setVods((prev) => prev.map((v) => (v.id === id ? { ...v, title: next } : v)));
    push({ kind: "success", title: "Title updated" });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setVods((prev) => prev.filter((v) => v.id !== deleteTarget.id));
    push({ kind: "success", title: `Deleted "${deleteTarget.title}"` });
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">Content</h1>

      <div className="flex gap-1 border-b border-surface-border">
        {(
          [
            { id: "broadcasts", label: "Past broadcasts & highlights" },
            { id: "clips", label: "Clips" }
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            role="tab"
            className={`focus-ring border-b-2 px-3.5 py-2.5 text-sm font-medium ${
              tab === t.id ? "border-brand-magenta text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "broadcasts" &&
        (vods.length === 0 ? (
          <EmptyState icon={Play} title="No broadcasts yet" description="Your past streams and highlights will show up here once you go live." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface-panel2 text-xs uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Duration</th>
                  <th className="px-4 py-2.5">Views</th>
                  <th className="px-4 py-2.5">Visibility</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border bg-surface-panel">
                {vods.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-2.5 text-ink">{v.title}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{v.category}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{formatDuration(v.durationMinutes)}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{formatCount(v.viewCount)}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={v.visibility}
                        onChange={(e) => updateVisibility(v.id, e.target.value as VOD["visibility"])}
                        className="rounded border border-surface-border bg-surface-raised px-2 py-1 text-xs text-ink"
                      >
                        <option value="public">Public</option>
                        <option value="subscribers">Subscribers</option>
                        <option value="private">Private</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => renameVod(v.id)} aria-label={`Rename ${v.title}`} className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => push({ kind: "info", title: "Download unavailable", description: backendRequiredMessage("storage") })}
                          aria-label={`Download ${v.title}`}
                          className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: v.id, title: v.title })}
                          aria-label={`Delete ${v.title}`}
                          className="focus-ring rounded p-1.5 text-ink-faint hover:bg-brand-red/10 hover:text-brand-red"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {tab === "clips" &&
        (clips.length === 0 ? (
          <EmptyState icon={Play} title="No clips yet" description="Clips made by you or your viewers will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {clips.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-lg border border-surface-border bg-surface-panel">
                <div
                  className="relative flex aspect-video items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c.thumbnailAccent[0]}30, ${c.thumbnailAccent[1]}20)` }}
                >
                  <Play size={20} className="text-ink/70" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-ink">{c.title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">by {c.clippedByUsername} · {formatCount(c.viewCount)} views</p>
                </div>
              </div>
            ))}
          </div>
        ))}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this video?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
