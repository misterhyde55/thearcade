"use client";

import { useState } from "react";
import { AlertTriangle, Copyright, FileText, Scissors, ShieldAlert, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { COPYRIGHT_CLAIMS } from "@/lib/mock-data";
import type { CopyrightClaim } from "@/lib/types";

const STATUS_LABEL: Record<CopyrightClaim["status"], { label: string; className: string }> = {
  muted_segment: { label: "Segment muted", className: "bg-amber-400/10 text-amber-400" },
  restricted: { label: "Restricted", className: "bg-brand-red/10 text-brand-red" },
  disputed: { label: "Dispute filed", className: "bg-brand-purple/10 text-brand-purple" },
  resolved_released: { label: "Resolved — released", className: "bg-brand-cyan/10 text-brand-cyan" },
  resolved_upheld: { label: "Resolved — upheld", className: "bg-surface-panel2 text-ink-faint" }
};

export default function CopyrightPage() {
  const { push } = useToast();
  const [claims, setClaims] = useState(COPYRIGHT_CLAIMS);
  const [disputeOpen, setDisputeOpen] = useState<CopyrightClaim | null>(null);
  const [streamDelay, setStreamDelay] = useState(0);
  const [regionBlocks, setRegionBlocks] = useState<string[]>([]);

  function fileDispute(claimId: string, note: string) {
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, status: "disputed" } : c)));
    push({ kind: "success", title: "Dispute filed", description: "A rights reviewer will respond within 5 business days." });
    setDisputeOpen(null);
    void note;
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionKicker>RIGHTS &amp; REACTIONS</SectionKicker>
        <h1 className="text-xl font-semibold text-ink">Copyright &amp; Reaction Content Tools</h1>
        <p className="mt-1 text-sm text-ink-muted">Built for reaction, commentary, gaming, and anime creators — claims, disputes, and rights docs in one place.</p>
      </div>

      <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-4 text-sm text-ink-muted">
        <span className="font-medium text-ink">Reaction content is not automatically fair use.</span> Fair use is determined case by case,
        and you remain responsible for having the rights to any material you show. These tools help you manage claims — they don&apos;t grant
        legal clearance.
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Copyright size={15} /> Copyright claims
        </h2>
        {claims.length === 0 ? (
          <p className="text-sm text-ink-muted">No active copyright claims on your content.</p>
        ) : (
          <div className="space-y-2">
            {claims.map((c) => {
              const status = STATUS_LABEL[c.status];
              return (
                <div key={c.id} className="rounded-lg border border-surface-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{c.vodTitle}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {c.id} · claimed timestamp {c.claimedTimestamp} · filed {formatRelativeTime(c.filedAt)}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
                  <p className="mt-1 text-xs text-ink-faint">Claimant: {c.claimantName ?? "Not disclosed to creator"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="focus-ring flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
                      <Scissors size={12} /> Trim / replace claimed segment
                    </button>
                    {c.status !== "disputed" && c.status !== "resolved_released" && c.status !== "resolved_upheld" && (
                      <button
                        onClick={() => setDisputeOpen(c)}
                        className="focus-ring rounded-md border border-brand-magenta/40 bg-brand-magenta/10 px-3 py-1.5 text-xs font-semibold text-brand-magenta hover:bg-brand-magenta/20"
                      >
                        File a counter-notice dispute
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Upload size={15} /> Rights documentation
          </h2>
          <p className="mb-3 text-xs text-ink-muted">Upload licenses, releases, or permission letters to reference during a dispute review.</p>
          <button
            onClick={() => push({ kind: "info", title: "Upload requires storage", description: "Wire an object storage provider (see footer) to enable real file uploads." })}
            className="focus-ring flex items-center gap-1.5 rounded-md border border-dashed border-surface-border px-3.5 py-2.5 text-sm text-ink-muted hover:border-brand-magenta hover:text-brand-magenta"
          >
            <FileText size={15} /> Upload a rights document
          </button>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ShieldAlert size={15} /> Broadcast safety options
          </h2>
          <label className="mb-3 block">
            <span className="mb-1 flex items-center justify-between text-xs font-medium text-ink-muted">
              <span>Stream delay</span>
              <span>{streamDelay === 0 ? "Off" : `${streamDelay}s`}</span>
            </span>
            <input type="range" min={0} max={60} step={10} value={streamDelay} onChange={(e) => setStreamDelay(Number(e.target.value))} className="w-full accent-brand-magenta" />
            <span className="mt-1 block text-xs text-ink-faint">A short delay gives you time to cut audio before a claimed clip reaches viewers live.</span>
          </label>
          <p className="mb-1.5 text-xs font-medium text-ink-muted">Region restrictions</p>
          <div className="flex flex-wrap gap-1.5">
            {["EU", "UK", "AU", "JP"].map((region) => {
              const active = regionBlocks.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => setRegionBlocks((prev) => (active ? prev.filter((r) => r !== region) : [...prev, region]))}
                  aria-pressed={active}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${active ? "border-brand-red/40 bg-brand-red/10 text-brand-red" : "border-surface-border text-ink-muted"}`}
                >
                  Block in {region}
                </button>
              );
            })}
          </div>
          <button onClick={() => push({ kind: "success", title: "Broadcast safety options saved" })} className="focus-ring mt-3 rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            Save
          </button>
        </section>
      </div>

      <div className="rounded-lg border border-dashed border-surface-border p-4 text-xs text-ink-faint">
        <p className="mb-1 flex items-center gap-1.5 font-medium text-ink-muted">
          <AlertTriangle size={12} /> Content review status
        </p>
        Automated content-ID scanning runs on every uploaded VOD before publishing. This prototype simulates the claims above — a real
        deployment would need a licensed content-recognition service connected here.
      </div>

      <DisputeModal claim={disputeOpen} onClose={() => setDisputeOpen(null)} onSubmit={fileDispute} />
    </div>
  );
}

function DisputeModal({ claim, onClose, onSubmit }: { claim: CopyrightClaim | null; onClose: () => void; onSubmit: (id: string, note: string) => void }) {
  const [note, setNote] = useState("");
  if (!claim) return null;

  return (
    <Modal open={Boolean(claim)} onClose={onClose} title={`Counter-notice for ${claim.id}`}>
      <p className="mb-3 text-sm text-ink-muted">
        Filing a counter-notice is a legal statement that you have the right to use this content. False counter-notices can carry legal
        consequences — only file if you believe the claim is mistaken or you hold the necessary rights.
      </p>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Explain why this claim is incorrect</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none" />
      </label>
      <button
        onClick={() => onSubmit(claim.id, note)}
        disabled={!note.trim()}
        className="focus-ring mt-3 w-full rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90 disabled:opacity-50"
      >
        Submit counter-notice
      </button>
    </Modal>
  );
}
