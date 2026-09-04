"use client";

import { useState } from "react";
import { Activity, Clock, LifeBuoy, Plus, Radio, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { SUPPORT_TICKETS } from "@/lib/mock-data";
import type { SupportTicket } from "@/lib/types";

const CATEGORY_LABEL: Record<SupportTicket["category"], string> = {
  technical: "Technical issue",
  monetization: "Monetization",
  moderation: "Moderation",
  safety: "Safety",
  feature_request: "Feature request"
};

const STATUS_LABEL: Record<SupportTicket["status"], { label: string; className: string }> = {
  open: { label: "Open", className: "bg-brand-cyan/10 text-brand-cyan" },
  awaiting_creator: { label: "Awaiting your reply", className: "bg-amber-400/10 text-amber-400" },
  awaiting_support: { label: "Awaiting support", className: "bg-brand-purple/10 text-brand-purple" },
  resolved: { label: "Resolved", className: "bg-surface-panel2 text-ink-faint" }
};

export default function SupportPage() {
  const { push } = useToast();
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [activeId, setActiveId] = useState<string | null>(SUPPORT_TICKETS[0]?.id ?? null);
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const active = tickets.find((t) => t.id === activeId) ?? null;

  function sendMessage() {
    if (!active || !draft.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, status: "awaiting_support", updatedAt: new Date().toISOString(), messages: [...t.messages, { author: "creator", body: draft.trim(), at: new Date().toISOString() }] }
          : t
      )
    );
    setDraft("");
    push({ kind: "success", title: "Message sent", description: "Support will reply within the estimated response time." });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionKicker>WE&apos;RE LISTENING</SectionKicker>
          <h1 className="text-xl font-semibold text-ink">Support Center</h1>
          <p className="mt-1 text-sm text-ink-muted">Real tickets, real status, real ETAs — not a form that disappears into a black hole.</p>
        </div>
        <div className="flex gap-2">
          <a href="#platform-status" className="focus-ring flex items-center gap-1.5 rounded-md border border-surface-border px-3.5 py-2 text-sm font-medium text-ink-muted hover:text-ink">
            <Activity size={15} /> Platform status
          </a>
          <button onClick={() => setNewOpen(true)} className="focus-ring flex items-center gap-1.5 rounded-md bg-brand-magenta px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            <Plus size={15} /> New ticket
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-surface-border p-10 text-center text-sm text-ink-muted">No support tickets yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-1.5">
            {tickets.map((t) => {
              const status = STATUS_LABEL[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`focus-ring block w-full rounded-lg border px-3.5 py-2.5 text-left ${
                    activeId === t.id ? "border-brand-magenta bg-brand-magenta/[0.06]" : "border-surface-border hover:border-surface-borderStrong"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-ink">{t.subject}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-faint">
                    {t.id} · {CATEGORY_LABEL[t.category]}
                    {t.priority === "live_broadcast" && (
                      <span className="flex items-center gap-0.5 text-brand-red">
                        <Radio size={10} /> Live priority
                      </span>
                    )}
                  </p>
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}>{status.label}</span>
                </button>
              );
            })}
          </div>

          {active && (
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{active.subject}</p>
                  <p className="text-xs text-ink-faint">
                    {active.id} · {CATEGORY_LABEL[active.category]} · opened {formatRelativeTime(active.createdAt)}
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <Clock size={12} /> ETA: within {active.etaHours}h
                </p>
              </div>

              <div className="mt-3 space-y-3">
                {active.messages.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${m.author === "creator" ? "ml-auto bg-brand-magenta/15 text-ink" : "bg-surface-panel2 text-ink-muted"}`}>
                    <p>{m.body}</p>
                    <p className="mt-1 text-[10px] text-ink-faint">{m.author === "creator" ? "You" : "Support"} · {formatRelativeTime(m.at)}</p>
                  </div>
                ))}
              </div>

              {active.status !== "resolved" ? (
                <div className="mt-4 flex gap-2 border-t border-surface-border pt-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Reply to support…"
                    className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
                  />
                  <button onClick={sendMessage} className="focus-ring flex items-center gap-1.5 rounded-md bg-brand-magenta px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
                    <Send size={14} />
                  </button>
                </div>
              ) : (
                <p className="mt-4 border-t border-surface-border pt-3 text-xs text-ink-faint">This ticket is resolved. Open a new one if the issue comes back.</p>
              )}
            </div>
          )}
        </div>
      )}

      <section id="platform-status" className="scroll-mt-20 rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Activity size={15} /> Platform status
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { name: "RTMP ingest", status: "Operational" },
            { name: "HLS playback", status: "Operational" },
            { name: "Live chat", status: "Operational" },
            { name: "Payouts", status: "Operational" }
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2 text-sm">
              <span className="text-ink-muted">{s.name}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" /> {s.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <NewTicketModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreate={(ticket) => {
          setTickets((prev) => [ticket, ...prev]);
          setActiveId(ticket.id);
          push({ kind: "success", title: "Ticket submitted", description: `Estimated response time: ${ticket.etaHours}h` });
        }}
      />
    </div>
  );
}

function NewTicketModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (t: SupportTicket) => void }) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("technical");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("standard");
  const [body, setBody] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    const ticket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject.trim(),
      category,
      status: "open",
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaHours: priority === "live_broadcast" ? 2 : 24,
      messages: [{ author: "creator", body: body.trim(), at: new Date().toISOString() }]
    };
    onCreate(ticket);
    setSubject("");
    setBody("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New support ticket">
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as SupportTicket["category"])} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none">
            {Object.entries(CATEGORY_LABEL).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
          <span className="flex items-center gap-1.5">
            <Radio size={13} className="text-brand-red" /> Priority: active live broadcast
          </span>
          <input type="checkbox" checked={priority === "live_broadcast"} onChange={(e) => setPriority(e.target.checked ? "live_broadcast" : "standard")} className="accent-brand-red" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Describe the issue</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} required className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
        </label>
        <button type="submit" className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90">
          <LifeBuoy size={15} /> Submit ticket
        </button>
      </form>
    </Modal>
  );
}
