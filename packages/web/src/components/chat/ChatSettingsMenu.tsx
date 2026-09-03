"use client";

import { useState } from "react";
import { Settings, ShieldAlert } from "lucide-react";
import type { ChatMode } from "./ChatPanel";

export function ChatSettingsMenu({ mode, onChange }: { mode: ChatMode; onChange: (next: ChatMode) => void }) {
  const [open, setOpen] = useState(false);

  function toggle<K extends keyof ChatMode>(key: K, value: ChatMode[K]) {
    onChange({ ...mode, [key]: value });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Chat settings"
        className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink"
      >
        <Settings size={15} />
      </button>
      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-64 rounded-md border border-surface-border bg-surface-panel p-3 shadow-card">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Chat modes</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-ink">
                Followers-only
                <input type="checkbox" checked={mode.followersOnly} onChange={(e) => toggle("followersOnly", e.target.checked)} className="accent-brand-magenta" />
              </label>
              <label className="flex items-center justify-between text-sm text-ink">
                Subscribers-only
                <input type="checkbox" checked={mode.subscribersOnly} onChange={(e) => toggle("subscribersOnly", e.target.checked)} className="accent-brand-magenta" />
              </label>
              <label className="flex items-center justify-between text-sm text-ink">
                Emote-only
                <input type="checkbox" checked={mode.emoteOnly} onChange={(e) => toggle("emoteOnly", e.target.checked)} className="accent-brand-magenta" />
              </label>
              <div className="flex items-center justify-between text-sm text-ink">
                Slow mode
                <select
                  value={mode.slowModeSeconds}
                  onChange={(e) => toggle("slowModeSeconds", Number(e.target.value))}
                  className="rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-xs"
                >
                  <option value={0}>Off</option>
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                </select>
              </div>
              <label className="flex items-center justify-between text-sm text-ink">
                Pause chat
                <input type="checkbox" checked={mode.paused} onChange={(e) => toggle("paused", e.target.checked)} className="accent-brand-magenta" />
              </label>
            </div>
            <button
              onClick={() => onChange({ followersOnly: true, subscribersOnly: false, emoteOnly: false, slowModeSeconds: 0, paused: true })}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-brand-red/40 bg-brand-red/10 py-1.5 text-xs font-semibold text-brand-red hover:bg-brand-red/20"
            >
              <ShieldAlert size={13} /> Panic: lock chat now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
