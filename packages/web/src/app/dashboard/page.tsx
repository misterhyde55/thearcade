"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth, errorMessage } from "@/lib/auth-context";
import type { Category, StreamCardData } from "@/lib/types";

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [streamKey, setStreamKey] = useState<string>("");
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!token || !user) return;
    api<{ streamKey: string }>("/api/auth/me", { token }).then((data) => setStreamKey(data.streamKey));
    api<{ stream: StreamCardData }>(`/api/streams/channel/${user.username}`).then((data) => {
      setTitle(data.stream.title);
      setCategorySlug(data.stream.category?.slug ?? "");
    });
    api<{ categories: Category[] }>("/api/categories").then((data) => setCategories(data.categories));
  }, [token, user]);

  async function saveDetails() {
    setError(null);
    setStatus(null);
    try {
      await api("/api/streams/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ title, categorySlug: categorySlug || undefined })
      });
      setStatus("Saved.");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function regenerateKey() {
    setError(null);
    try {
      const data = await api<{ streamKey: string }>("/api/auth/stream-key/regenerate", {
        method: "POST",
        token
      });
      setStreamKey(data.streamKey);
      setStatus("New stream key generated — update OBS with the new key.");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  if (!user) return null;

  const rtmpUrl = process.env.NEXT_PUBLIC_RTMP_URL ?? "rtmp://localhost:1935/live";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-pixel text-lg text-neon-yellow">CONTROL PANEL</h1>

      <section className="rounded-lg border-2 border-arcade-border bg-arcade-panel p-5">
        <h2 className="font-pixel text-xs text-neon-cyan">GO LIVE</h2>
        <p className="mt-2 font-mono text-sm text-arcade-cyan/70">
          Point OBS (or any RTMP encoder) at:
        </p>
        <div className="mt-2 rounded border-2 border-arcade-border bg-arcade-bg p-2 font-mono text-sm text-arcade-green">
          Server: {rtmpUrl}
        </div>
        <div className="mt-2 flex items-center gap-2 rounded border-2 border-arcade-border bg-arcade-bg p-2 font-mono text-sm text-arcade-green">
          <span className="flex-1 truncate">Key: {showKey ? streamKey : "•".repeat(24)}</span>
          <button onClick={() => setShowKey((v) => !v)} className="text-arcade-cyan hover:text-neon-cyan">
            {showKey ? "hide" : "show"}
          </button>
        </div>
        <button
          onClick={regenerateKey}
          className="mt-3 rounded border-2 border-arcade-orange px-3 py-1.5 font-mono text-xs text-arcade-orange hover:bg-arcade-orange/10"
        >
          Regenerate key
        </button>
        <p className="mt-2 font-mono text-xs text-arcade-cyan/50">
          Never share your stream key — it lets anyone broadcast as you.
        </p>
      </section>

      <section className="rounded-lg border-2 border-arcade-border bg-arcade-panel p-5">
        <h2 className="font-pixel text-xs text-neon-magenta">BROADCAST DETAILS</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              className="mt-1 w-full rounded border-2 border-arcade-border bg-arcade-bg px-3 py-2 font-mono text-white outline-none focus:border-arcade-cyan"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-arcade-cyan/70">Category / cabinet</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="mt-1 w-full rounded border-2 border-arcade-border bg-arcade-bg px-3 py-2 font-mono text-white outline-none focus:border-arcade-cyan"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={saveDetails}
            className="rounded border-2 border-arcade-magenta bg-arcade-magenta/10 px-4 py-2 font-pixel text-xs text-neon-magenta hover:bg-arcade-magenta/20"
          >
            Save
          </button>
          {status && <p className="font-mono text-sm text-arcade-green">{status}</p>}
          {error && <p className="font-mono text-sm text-arcade-orange">{error}</p>}
        </div>
      </section>
    </div>
  );
}
