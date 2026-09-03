"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bot, ChevronDown, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { MODERATION_CASES } from "@/lib/mock-data";
import { backendRequiredMessage } from "@/lib/backend-notice";
import type { ModerationCase } from "@/lib/types";

const STATUS_LABEL: Record<ModerationCase["status"], string> = {
  active: "Active restriction",
  under_appeal: "Appeal under review",
  overturned: "Appeal upheld — restriction removed",
  upheld: "Appeal reviewed — restriction stands",
  expired: "Restriction expired"
};

export default function ModerationPage() {
  const { push } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(MODERATION_CASES[0]?.id ?? null);
  const [cases, setCases] = useState(MODERATION_CASES);
  const [raidProtection, setRaidProtection] = useState(true);

  function submitAppeal(id: string) {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "under_appeal",
              appealSubmittedAt: new Date().toISOString(),
              appealResponseEtaHours: 48,
              appealHistory: [...c.appealHistory, { at: new Date().toISOString(), actor: "You", note: "Appeal submitted." }]
            }
          : c
      )
    );
    push({ kind: "success", title: "Appeal submitted", description: "Expect a response within 48 hours." });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Moderation & Safety</h1>
        <p className="mt-1 text-sm text-ink-muted">Every enforcement action against your channel, with the specific rule, evidence, and a clear path to appeal.</p>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Moderation & appeals center</h2>
        {cases.length === 0 ? (
          <p className="text-sm text-ink-muted">No moderation actions on your channel. Nothing to review.</p>
        ) : (
          <div className="space-y-2">
            {cases.map((c) => {
              const expanded = expandedId === c.id;
              const hasAppeal = Boolean(c.appealSubmittedAt);
              const canAppeal = c.status === "active" || c.status === "upheld";
              return (
                <div key={c.id} className="rounded-lg border border-surface-border">
                  <button
                    onClick={() => setExpandedId(expanded ? null : c.id)}
                    aria-expanded={expanded}
                    className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{c.ruleLabel}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        Case {c.id} · {STATUS_LABEL[c.status]} · {formatRelativeTime(c.issuedAt)}
                      </p>
                    </div>
                    <ChevronDown size={16} className={`shrink-0 text-ink-faint transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded && (
                    <div className="border-t border-surface-border px-4 py-4 text-sm">
                      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Detail label="Rule">{c.ruleLabel}</Detail>
                        <Detail label="Decision made by">
                          <span className="flex items-center gap-1.5">
                            {c.decisionMaker === "automated" ? <Bot size={13} /> : <User size={13} />}
                            {c.decisionMaker === "automated" ? "Automated system" : "Human reviewer"}
                          </span>
                        </Detail>
                        <Detail label="Content under review">{c.summary}</Detail>
                        <Detail label="Evidence">
                          {c.evidenceDescription}
                          {c.evidenceTimestamp && ` (timestamp ${c.evidenceTimestamp})`}
                        </Detail>
                        <Detail label="Restriction">{c.restrictionLabel}</Detail>
                        <Detail label="Restriction ends">{c.restrictionEndsAt ? formatRelativeTime(c.restrictionEndsAt) : "No end date set"}</Detail>
                        <Detail label="Appeal window">{c.appealWindowHours} hours from issue date</Detail>
                        {c.appealResponseEtaHours && <Detail label="Expected response time">Within {c.appealResponseEtaHours} hours</Detail>}
                      </dl>

                      <div className="mt-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">History</p>
                        <ul className="space-y-1.5 border-l border-surface-border pl-3">
                          {c.appealHistory.map((h, i) => (
                            <li key={i} className="text-xs text-ink-muted">
                              <span className="text-ink">{h.actor}</span> — {h.note} · {formatRelativeTime(h.at)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        {hasAppeal ? (
                          <p className="text-xs text-ink-faint">Appeal already submitted for this case.</p>
                        ) : canAppeal ? (
                          <button onClick={() => submitAppeal(c.id)} className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-xs font-semibold text-white hover:bg-brand-magenta/90">
                            Appeal this decision
                          </button>
                        ) : (
                          <p className="text-xs text-ink-faint">This case isn't eligible for a new appeal.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ShieldCheck size={15} /> Creator safety tools
          </h2>
          <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
            Raid protection (hold new followers/chat during sudden viewer spikes)
            <input type="checkbox" checked={raidProtection} onChange={(e) => setRaidProtection(e.target.checked)} className="accent-brand-magenta" />
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/dashboard/stream-manager" className="focus-ring rounded-md border border-brand-red/40 bg-brand-red/10 px-3 py-1.5 text-xs font-semibold text-brand-red hover:bg-brand-red/20">
              Open panic button in Stream Manager
            </Link>
            <Link href="/dashboard/community" className="focus-ring rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
              Moderator activity log
            </Link>
          </div>
          <div className="mt-4 rounded-md border border-dashed border-surface-border p-3 text-xs text-ink-faint">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-ink-muted">
              <AlertTriangle size={12} /> Ban-evasion detection
            </p>
            Placeholder — flags accounts with signals matching a banned user (device, IP range, rapid re-follow). {backendRequiredMessage("moderation-ai")}
          </div>
        </div>

        <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ShieldAlert size={15} /> Suspicious account warnings
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="rounded-md border border-amber-400/30 bg-amber-400/[0.06] px-3 py-2 text-ink-muted">
              <span className="text-ink">guest_9182_alt</span> followed 4 minutes after a banned account with a similar username pattern.
            </li>
            <li className="rounded-md border border-surface-border px-3 py-2 text-ink-muted">No other suspicious signals in the last 7 days.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
