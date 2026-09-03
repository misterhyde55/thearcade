"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface DemoThread {
  id: string;
  username: string;
  color: string;
  initials: string;
  messages: { from: "them" | "me"; body: string }[];
}

const INITIAL_THREADS: DemoThread[] = [
  {
    id: "t1",
    username: "modAlex",
    color: "#8b5cf6",
    initials: "MA",
    messages: [
      { from: "them", body: "Queue's clear, nothing needs your attention before tonight's stream." },
      { from: "me", body: "Appreciate it — see you at 8." }
    ]
  },
  {
    id: "t2",
    username: "NovaStrikes",
    color: "#22d3ee",
    initials: "NS",
    messages: [{ from: "them", body: "Collab watch-along next month? Chat's been asking." }]
  }
];

export function MessagesMenu() {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(INITIAL_THREADS[0].id);
  const [draft, setDraft] = useState("");

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  function send() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, { from: "me", body: trimmed }] } : t))
    );
    setDraft("");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Messages"
        className="focus-ring rounded-md p-2 text-ink-muted hover:bg-surface-panel2 hover:text-ink"
      >
        <MessageSquare size={19} />
      </button>
      {open && (
        <>
          <button aria-hidden className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} tabIndex={-1} />
          <div className="absolute right-0 z-40 mt-2 flex w-[26rem] max-w-[92vw] rounded-lg border border-surface-border bg-surface-panel shadow-card">
            <div className="w-36 shrink-0 border-r border-surface-border py-2">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${
                    t.id === active.id ? "bg-surface-panel2 text-ink" : "text-ink-muted hover:bg-surface-panel2"
                  }`}
                >
                  <Avatar color={t.color} initials={t.initials} size={22} />
                  <span className="truncate">{t.username}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="border-b border-surface-border px-3 py-2.5">
                <p className="text-sm font-semibold text-ink">{active.username}</p>
              </div>
              <div className="flex max-h-56 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
                {active.messages.map((m, i) => (
                  <p
                    key={i}
                    className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs ${
                      m.from === "me" ? "self-end bg-brand-magenta/20 text-ink" : "self-start bg-surface-panel2 text-ink-muted"
                    }`}
                  >
                    {m.body}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-surface-border p-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Message…"
                  aria-label="Message"
                  className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-xs text-ink outline-none placeholder:text-ink-faint"
                />
                <button
                  onClick={send}
                  aria-label="Send message"
                  className="focus-ring rounded-md bg-brand-magenta p-1.5 text-white hover:bg-brand-magenta/90"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
