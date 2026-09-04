"use client";

import { useState } from "react";
import { ClipboardList, Gavel, MapPinned, MessageSquareText, ThumbsDown, ThumbsUp, Vote } from "lucide-react";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { Pill } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/format";
import { COUNCIL_PROPOSALS } from "@/lib/mock-data";
import type { CouncilProposal } from "@/lib/types";

export default function CouncilPage() {
  const { push } = useToast();
  const [proposals, setProposals] = useState(COUNCIL_PROPOSALS);
  const [voted, setVoted] = useState<Record<string, "for" | "against">>({});
  const [feedback, setFeedback] = useState("");

  function castVote(id: string, direction: "for" | "against") {
    if (voted[id]) return;
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votesFor: p.votesFor + (direction === "for" ? 1 : 0), votesAgainst: p.votesAgainst + (direction === "against" ? 1 : 0) } : p))
    );
    setVoted((prev) => ({ ...prev, [id]: direction }));
    push({ kind: "success", title: "Vote recorded" });
  }

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    push({ kind: "success", title: "Feedback submitted", description: "Visible to the platform team and other verified creators." });
    setFeedback("");
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionKicker>CREATORS SET THE ROADMAP</SectionKicker>
        <h1 className="text-xl font-semibold text-ink">Creator Council</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Verified active creators vote on proposals, review policy changes, and see the public roadmap. Every item below is labeled
          advisory or binding — advisory input informs decisions; it doesn&apos;t make them.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Vote size={15} /> Proposals
        </h2>
        {proposals.map((p) => {
          const total = p.votesFor + p.votesAgainst || 1;
          const forPct = Math.round((p.votesFor / total) * 100);
          const myVote = voted[p.id];
          return (
            <div key={p.id} className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{p.summary}</p>
                </div>
                <DecisionPill proposal={p} />
              </div>

              {p.status === "voting" && (
                <>
                  <div className="mt-3 h-2 w-full rounded-full bg-surface-panel2">
                    <div className="h-full rounded-full bg-brand-cyan" style={{ width: `${forPct}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-faint">
                    {forPct}% in favor · {p.votesFor + p.votesAgainst} votes · closes {formatRelativeTime(p.closesAt)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => castVote(p.id, "for")}
                      disabled={Boolean(myVote)}
                      className={`focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                        myVote === "for" ? "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan" : "border-surface-border text-ink-muted hover:text-ink"
                      }`}
                    >
                      <ThumbsUp size={12} /> {myVote === "for" ? "Voted for" : "Vote for"}
                    </button>
                    <button
                      onClick={() => castVote(p.id, "against")}
                      disabled={Boolean(myVote)}
                      className={`focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                        myVote === "against" ? "border-brand-red/40 bg-brand-red/10 text-brand-red" : "border-surface-border text-ink-muted hover:text-ink"
                      }`}
                    >
                      <ThumbsDown size={12} /> {myVote === "against" ? "Voted against" : "Vote against"}
                    </button>
                  </div>
                </>
              )}

              {p.status !== "voting" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
                  <Gavel size={12} />
                  {p.status === "decided_binding" && `Decided (binding) · ${p.votesFor} for / ${p.votesAgainst} against`}
                  {p.status === "advisory_review" && "Under advisory review — no vote, feeding into engineering prioritization"}
                  {p.status === "decided_advisory" && `Advisory input recorded · ${p.votesFor} for / ${p.votesAgainst} against`}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <MapPinned size={15} /> Public roadmap
          </h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2">
              <span>LL-HLS latency improvements</span>
              <Pill tone="brand">In progress</Pill>
            </li>
            <li className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2">
              <span>Clip Highlights row on channel pages</span>
              <Pill>Planned</Pill>
            </li>
            <li className="flex items-center justify-between rounded-md border border-surface-border px-3 py-2">
              <span>Sponsorship marketplace beta</span>
              <Pill>Exploring</Pill>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ClipboardList size={15} /> Resolved creator concerns
          </h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="rounded-md border border-surface-border px-3 py-2">
              &ldquo;Minimum payout is too high for new creators&rdquo; — addressed via the payout-threshold proposal above.
            </li>
            <li className="rounded-md border border-surface-border px-3 py-2">
              &ldquo;No way to see why a stream got recommended&rdquo; — addressed: every Discovery card now shows its reason.
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <MessageSquareText size={15} /> Submit feedback or nominate a representative
        </h2>
        <form onSubmit={submitFeedback} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share feedback, or nominate yourself/another creator as a representative"
            className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
          />
          <button type="submit" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}

function DecisionPill({ proposal }: { proposal: CouncilProposal }) {
  const binding = proposal.decisionType === "binding";
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        binding ? "border-brand-red/40 bg-brand-red/10 text-brand-red" : "border-surface-border bg-surface-panel2 text-ink-faint"
      }`}
    >
      {binding ? "Binding" : "Advisory"}
    </span>
  );
}
