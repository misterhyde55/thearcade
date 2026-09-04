"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileWarning,
  Gavel,
  ShieldAlert,
  ShieldCheck,
  User,
  Users
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { formatRelativeTime } from "@/lib/format";
import { MODERATION_CASES, REPORTS_AGAINST_CREATOR } from "@/lib/mock-data";
import { backendRequiredMessage } from "@/lib/backend-notice";
import type { ModerationCase } from "@/lib/types";

const STATUS_LABEL: Record<ModerationCase["status"], string> = {
  active: "Active restriction",
  under_appeal: "Appeal under review",
  overturned: "Appeal upheld — restriction removed",
  upheld: "Appeal reviewed — restriction stands",
  expired: "Restriction expired"
};

const REPUTATION_LABEL: Record<string, { label: string; className: string }> = {
  new_account: { label: "New account", className: "text-amber-400" },
  mixed_history: { label: "Mixed history", className: "text-ink-muted" },
  trusted: { label: "Trusted reporter", className: "text-brand-cyan" }
};

function otherFeaturesNote(c: ModerationCase): string {
  if (c.restrictionLabel.toLowerCase().includes("vod")) {
    return "Full access to Stream Manager, Dashboard, and Discovery. Only the flagged VOD segment is affected.";
  }
  return "Full access to Stream Manager, Dashboard, and Discovery — this restriction is limited to the account named in the case.";
}

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

  const needsAttention = cases.filter((c) => c.status === "active" || c.status === "under_appeal");
  const history = cases.filter((c) => c.status === "overturned" || c.status === "upheld" || c.status === "expired");

  const coordinatedReports = REPORTS_AGAINST_CREATOR.filter((r) => r.flaggedCoordinated);
  const otherReports = REPORTS_AGAINST_CREATOR.filter((r) => !r.flaggedCoordinated);

  return (
    <div className="space-y-6">
      <div>
        <SectionKicker>TRUST &amp; SAFETY</SectionKicker>
        <h1 className="text-xl font-semibold text-ink">Fair Play Center</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every enforcement action against your channel, with the specific rule, evidence, and a clear path to appeal. A high
          report count triggers review here — it never proves guilt on its own.
        </p>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Needs your attention</h2>
        {needsAttention.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing active. Your channel is in good standing.</p>
        ) : (
          <div className="space-y-2">
            {needsAttention.map((c) => (
              <CaseRow key={c.id} case={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onAppeal={submitAppeal} />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Previous moderation history</h2>
          <div className="space-y-2">
            {history.map((c) => (
              <CaseRow key={c.id} case={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onAppeal={submitAppeal} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Users size={15} /> Protection from false reports
        </h2>
        <p className="mb-3 text-xs text-ink-faint">
          Reports are weighted by reporter reputation and checked for coordination before any action is taken.
        </p>

        {coordinatedReports.length > 0 && (
          <div className="mb-3 rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3">
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-400">
              <FileWarning size={14} /> Possible coordinated reporting detected
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {coordinatedReports.length} reports for the same reason arrived within minutes of each other, all from
              low-reputation accounts. This pattern is flagged for human review — no restriction was applied automatically.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          {REPORTS_AGAINST_CREATOR.map((r) => {
            const rep = REPUTATION_LABEL[r.reporterReputation];
            return (
              <div key={r.id} className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2 text-xs">
                <span className="text-ink-muted">
                  <span className="text-ink">{r.reporterUsername}</span> reported your {r.targetType.replace("_", " ")} for &ldquo;{r.reason}
                  &rdquo; · {formatRelativeTime(r.submittedAt)}
                </span>
                <span className={`font-medium ${rep.className}`}>{rep.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-surface-border p-3 text-xs text-ink-muted">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-ink">
              <Gavel size={12} /> Report-abuse policy
            </p>
            Accounts that repeatedly file reports later found to be false lose reporting privileges and may face separate
            enforcement. Serious punishments (suspensions, bans) always require human review — never an automated report count alone.
          </div>
          <div className="rounded-md border border-surface-border p-3 text-xs text-ink-muted">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-ink">
              <CheckCircle2 size={12} /> Emergency actions get reviewed fast
            </p>
            Any temporary restriction applied while a report is investigated is reviewed by a human within hours, not days —
            it&apos;s never left standing on an automated flag alone.
          </div>
        </div>
        {otherReports.length === 0 && coordinatedReports.length === 0 && (
          <p className="text-sm text-ink-muted">No reports filed against your channel recently.</p>
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
              Open Lockdown Mode in Stream Manager
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

function CaseRow({
  case: c,
  expanded,
  onToggle,
  onAppeal
}: {
  case: ModerationCase;
  expanded: boolean;
  onToggle: () => void;
  onAppeal: (id: string) => void;
}) {
  const hasAppeal = Boolean(c.appealSubmittedAt);
  const canAppeal = c.status === "active" || c.status === "upheld";

  return (
    <div className="rounded-lg border border-surface-border">
      <button onClick={onToggle} aria-expanded={expanded} className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
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

          <div className="mt-3 rounded-md border border-brand-cyan/25 bg-brand-cyan/[0.05] p-2.5 text-xs text-ink-muted">
            <span className="font-medium text-brand-cyan">Other platform access: </span>
            {otherFeaturesNote(c)}
          </div>

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
              <button onClick={() => onAppeal(c.id)} className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-xs font-semibold text-white hover:bg-brand-magenta/90">
                Appeal this decision
              </button>
            ) : (
              <p className="text-xs text-ink-faint">This case isn&apos;t eligible for a new appeal.</p>
            )}
          </div>
        </div>
      )}
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
