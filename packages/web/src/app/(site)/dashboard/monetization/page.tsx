"use client";

import { Briefcase, Info } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { backendRequiredMessage } from "@/lib/backend-notice";
import { useDemoSession } from "@/lib/demo-session";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { PAYOUTS } from "@/lib/mock-data";

export default function MonetizationPage() {
  const { creator } = useDemoSession();
  const { push } = useToast();
  if (!creator) return null;

  const grossThisPeriod = PAYOUTS[0].grossRevenue;
  const minimumPayout = 50;
  const towardMinimum = Math.min(100, (grossThisPeriod / minimumPayout) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">Monetization</h1>

      <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-cyan" />
          <p className="text-sm text-ink-muted">
            <span className="font-medium text-ink">Proposed creator-first split: 85% to you, 15% platform fee</span> — this is the model this
            prototype is designed around, not a legally finalized guarantee. Payment processing fees (typically ~2.9% + $0.30 per transaction)
            are itemized separately below and are never part of the platform's cut.
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Subscription tiers</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {creator.subscriptionTiers.map((tier) => (
            <div key={tier.id} className="rounded-lg border border-surface-border bg-surface-panel p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{tier.name}</p>
                <p className="text-sm text-ink">{formatCurrency(tier.priceMonthly)}/mo</p>
              </div>
              {tier.isFoundingAvailable && (
                <p className="mt-1 text-xs text-amber-400">Founding tier — {tier.foundingSlotsRemaining} slots left</p>
              )}
              <ul className="mt-2 space-y-1">
                {tier.perks.map((p) => (
                  <li key={p} className="text-xs text-ink-muted">
                    · {p}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => push({ kind: "success", title: "Tier updated" })}
                className="mt-3 w-full rounded-md border border-surface-border py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Edit tier
              </button>
            </div>
          ))}
          <button
            onClick={() => push({ kind: "info", title: "New tier draft created", description: "Configure pricing and perks, then publish." })}
            className="focus-ring flex items-center justify-center rounded-lg border border-dashed border-surface-border p-4 text-sm text-ink-muted hover:border-brand-magenta hover:text-brand-magenta"
          >
            + Add subscription tier
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Payouts</h2>
        <p className="mb-2 text-xs text-ink-muted">
          Minimum payout threshold: {formatCurrency(minimumPayout)}. Current period: {formatCurrency(grossThisPeriod)} gross ({Math.round(towardMinimum)}% toward
          minimum).
        </p>
        <div className="h-2 w-full max-w-sm rounded-full bg-surface-panel2">
          <div className="h-full rounded-full bg-brand-cyan" style={{ width: `${towardMinimum}%` }} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="py-2">Period</th>
                <th className="py-2">Gross</th>
                <th className="py-2">Platform fee</th>
                <th className="py-2">Processing fee</th>
                <th className="py-2">Net payout</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {PAYOUTS.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 text-ink">{p.periodLabel}</td>
                  <td className="py-2.5 text-ink-muted">{formatCurrency(p.grossRevenue)}</td>
                  <td className="py-2.5 text-ink-muted">{formatCurrency(p.platformFee)}</td>
                  <td className="py-2.5 text-ink-muted">{formatCurrency(p.processingFee)}</td>
                  <td className="py-2.5 font-medium text-ink">{formatCurrency(p.netPayout)}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === "paid"
                          ? "bg-brand-cyan/10 text-brand-cyan"
                          : p.status === "processing"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-surface-panel2 text-ink-faint"
                      }`}
                    >
                      {p.status}
                      {p.paidAt ? ` · ${formatRelativeTime(p.paidAt)}` : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-faint">{backendRequiredMessage("payments")}</p>
      </section>

      <section className="rounded-lg border border-dashed border-surface-border bg-surface-panel/60 p-5">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Briefcase size={15} /> Sponsorship marketplace
        </h2>
        <p className="text-sm text-ink-muted">
          A future space for brands to offer sponsorships directly to creators with transparent terms. Not yet available in this prototype.
        </p>
        <button
          onClick={() => push({ kind: "info", title: "Marketplace coming later", description: "This section is a placeholder for a future release." })}
          className="focus-ring mt-3 rounded-md border border-surface-border px-3.5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
        >
          Notify me when this launches
        </button>
      </section>
    </div>
  );
}
