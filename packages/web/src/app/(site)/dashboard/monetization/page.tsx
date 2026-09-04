"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Coins,
  Gift,
  Goal,
  Info,
  Link as LinkIcon,
  Megaphone,
  Radio,
  ShoppingBag,
  Ticket,
  Users
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { backendRequiredMessage } from "@/lib/backend-notice";
import { useDemoSession } from "@/lib/demo-session";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { AD_REVENUE_LOG, ANALYTICS, CREATOR_GOAL, DEFAULT_AD_SETTINGS, PAYOUTS, STREAM_REVENUE } from "@/lib/mock-data";

type Tab = "earnings" | "tiers" | "earn-more" | "advertising";

const TABS: { id: Tab; label: string }[] = [
  { id: "earnings", label: "Earnings" },
  { id: "tiers", label: "Tiers & Memberships" },
  { id: "earn-more", label: "More Ways to Earn" },
  { id: "advertising", label: "Advertising" }
];

const PROCESSING_FEE_RATE = 0.029;
const PROCESSING_FEE_FLAT = 0.3;
const PLATFORM_FEE_RATE = 0.15;

export default function MonetizationPage() {
  const { creator } = useDemoSession();
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("earnings");
  if (!creator) return null;

  const grossThisPeriod = ANALYTICS.estimatedRevenue30d;
  const processingFee = grossThisPeriod * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT * 12;
  const platformFee = grossThisPeriod * PLATFORM_FEE_RATE;
  const refunds = 18.4;
  const netEstimate = grossThisPeriod - processingFee - platformFee - refunds;
  const minimumPayout = 50;
  const towardMinimum = Math.min(100, (netEstimate / minimumPayout) * 100);

  const revenueBySource = [
    { label: "Subscriptions", amount: sum(STREAM_REVENUE, "subscriptions"), color: "bg-brand-magenta" },
    { label: "Tips", amount: sum(STREAM_REVENUE, "tips"), color: "bg-brand-cyan" },
    { label: "Gifted subs", amount: sum(STREAM_REVENUE, "giftedSubs"), color: "bg-brand-purple" },
    { label: "Ads", amount: sum(STREAM_REVENUE, "ads"), color: "bg-amber-400" }
  ];
  const sourceTotal = revenueBySource.reduce((n, s) => n + s.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <SectionKicker>PAYOUT COUNTER</SectionKicker>
        <h1 className="text-xl font-semibold text-ink">Monetization</h1>
      </div>

      <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-cyan" />
          <p className="text-sm text-ink-muted">
            <span className="font-medium text-ink">Proposed creator-first split: 85% to you, 15% platform fee</span> — this is the model this
            prototype is designed around, not a legally finalized guarantee. Payment processing fees (~2.9% + $0.30 per transaction) and any
            applicable taxes/withholding are itemized separately below and are never part of the platform&apos;s cut.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-surface-border">
        {TABS.map((t) => (
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

      {tab === "earnings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Stat label="Gross (30d)" value={formatCurrency(grossThisPeriod)} />
            <Stat label="Processing fees" value={`- ${formatCurrency(processingFee)}`} tone="muted" />
            <Stat label="Platform fee (15%)" value={`- ${formatCurrency(platformFee)}`} tone="muted" />
            <Stat label="Refunds / chargebacks" value={`- ${formatCurrency(refunds)}`} tone="muted" />
            <Stat label="Est. net payout" value={formatCurrency(Math.max(0, netEstimate))} tone="highlight" />
          </div>
          <p className="text-xs text-ink-faint">
            Taxes or withholding apply only where required by local law and would be itemized here once a real payment provider is
            connected — none are simulated in this estimate.
          </p>

          <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Payouts</h2>
            <p className="mb-2 text-xs text-ink-muted">
              Minimum payout threshold: {formatCurrency(minimumPayout)}. Current period: {formatCurrency(Math.max(0, netEstimate))} net (
              {Math.round(towardMinimum)}% toward minimum). Next payout, once threshold is met: 5th of next month.
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

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Revenue by source (last 4 streams)</h2>
              <div className="space-y-2">
                {revenueBySource.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-xs text-ink-muted">{s.label}</span>
                    <div className="h-2.5 flex-1 rounded-full bg-surface-panel2">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.amount / sourceTotal) * 100}%` }} />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs text-ink-muted">{formatCurrency(s.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Revenue by stream</h2>
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-xs">
                  <thead className="text-ink-faint">
                    <tr>
                      <th className="pb-1.5 font-medium">Stream</th>
                      <th className="pb-1.5 font-medium">Date</th>
                      <th className="pb-1.5 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {STREAM_REVENUE.map((s) => (
                      <tr key={s.streamTitle}>
                        <td className="py-1.5 pr-2 text-ink">{s.streamTitle}</td>
                        <td className="py-1.5 text-ink-faint">{s.date}</td>
                        <td className="py-1.5 text-right font-medium text-ink">{formatCurrency(s.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === "tiers" && <TiersTab creator={creator} push={push} />}
      {tab === "earn-more" && <EarnMoreTab push={push} />}
      {tab === "advertising" && <AdvertisingTab push={push} />}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "muted" | "highlight" }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-panel p-4">
      <p className={`text-lg font-semibold ${tone === "highlight" ? "text-brand-cyan" : tone === "muted" ? "text-ink-muted" : "text-ink"}`}>{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}

type Push = ReturnType<typeof useToast>["push"];

function TiersTab({ creator, push }: { creator: NonNullable<ReturnType<typeof useDemoSession>["creator"]>; push: Push }) {
    const [freeTrial, setFreeTrial] = useState(false);
    const [adFree, setAdFree] = useState(true);
    const [membersOnlyStreams, setMembersOnlyStreams] = useState(false);
    const [membersOnlyVods, setMembersOnlyVods] = useState(true);
    const [promo, setPromo] = useState("");

    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Membership options</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
              7-day free trial for new subscribers
              <input type="checkbox" checked={freeTrial} onChange={(e) => setFreeTrial(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
              Ad-free viewing for all subscriber tiers
              <input type="checkbox" checked={adFree} onChange={(e) => setAdFree(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
              Members-only streams enabled
              <input type="checkbox" checked={membersOnlyStreams} onChange={(e) => setMembersOnlyStreams(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between rounded-md border border-surface-border px-3.5 py-2.5 text-sm text-ink">
              Members-only VODs enabled
              <input type="checkbox" checked={membersOnlyVods} onChange={(e) => setMembersOnlyVods(e.target.checked)} className="accent-brand-magenta" />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Limited-time promo (e.g. &ldquo;20% off first month&rdquo;)</span>
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="No active promotion"
                className="focus-ring w-72 rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none"
              />
            </label>
            <button
              onClick={() => push({ kind: "success", title: "Membership options saved" })}
              className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-faint">Pricing changes must still respect platform minimums, processing costs, and local law.</p>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink">Subscription tiers</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {creator!.subscriptionTiers.map((tier) => (
              <div key={tier.id} className="rounded-lg border border-surface-border bg-surface-panel p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{tier.name}</p>
                  <p className="text-sm text-ink">{formatCurrency(tier.priceMonthly)}/mo</p>
                </div>
                {tier.isFoundingAvailable && <p className="mt-1 text-xs text-amber-400">Founding tier — {tier.foundingSlotsRemaining} slots left</p>}
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
      </div>
    );
  }

function EarnMoreTab({ push }: { push: Push }) {
    const [goalTarget, setGoalTarget] = useState(CREATOR_GOAL.targetAmount);
    const [tipsEnabled, setTipsEnabled] = useState(true);
    const [giftingEnabled, setGiftingEnabled] = useState(true);
    const [links, setLinks] = useState<{ id: string; label: string; url: string }[]>([
      { id: "l1", label: "Merch store", url: "https://merch.example.com/hydepirates" }
    ]);
    const goalPct = Math.min(100, (CREATOR_GOAL.currentAmount / goalTarget) * 100);

    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Goal size={15} /> Creator goal
          </h2>
          <p className="mb-3 text-sm text-ink-muted">{CREATOR_GOAL.label}</p>
          <div className="h-2.5 w-full rounded-full bg-surface-panel2">
            <div className="h-full rounded-full bg-brand-purple" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            {CREATOR_GOAL.currentAmount} / {goalTarget} {CREATOR_GOAL.unit} · shown live on your stream overlay
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(Number(e.target.value) || 0)}
              className="focus-ring w-28 rounded-md border border-surface-border bg-surface-raised px-3 py-1.5 text-sm text-ink outline-none"
            />
            <button onClick={() => push({ kind: "success", title: "Goal target updated" })} className="focus-ring rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
              Update target
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Coins size={15} /> Tips
            </h3>
            <label className="flex items-center justify-between text-sm text-ink">
              Accept tips during streams
              <input type="checkbox" checked={tipsEnabled} onChange={(e) => setTipsEnabled(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <p className="mt-2 text-xs text-ink-faint">Tips go straight to you, minus payment processing fees only — no platform cut.</p>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Gift size={15} /> Gift memberships
            </h3>
            <label className="flex items-center justify-between text-sm text-ink">
              Allow viewers to gift subscriptions
              <input type="checkbox" checked={giftingEnabled} onChange={(e) => setGiftingEnabled(e.target.checked)} className="accent-brand-magenta" />
            </label>
            <p className="mt-2 text-xs text-ink-faint">Gifted subs count toward founding-member slots the same as a regular subscription.</p>
          </div>

          <div className="rounded-lg border border-dashed border-surface-border bg-surface-panel/60 p-5">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Ticket size={15} /> Paid events &amp; ticketed watch parties
            </h3>
            <p className="text-xs text-ink-muted">
              Sell tickets to a one-off premiere or watch party where legally permitted in your region. Not yet available in this prototype.
            </p>
            <button onClick={() => push({ kind: "info", title: "Added to notify list" })} className="focus-ring mt-3 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
              Notify me when this launches
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-surface-border bg-surface-panel/60 p-5">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Briefcase size={15} /> Sponsorship marketplace
            </h3>
            <p className="text-xs text-ink-muted">A future space for brands to offer sponsorships directly to creators with transparent terms.</p>
            <button onClick={() => push({ kind: "info", title: "Added to notify list" })} className="focus-ring mt-3 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
              Notify me when this launches
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-surface-border bg-surface-panel/60 p-5">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Users size={15} /> Community funding
            </h3>
            <p className="text-xs text-ink-muted">Let your community pool toward a shared goal (new gear, a charity drive). Not yet available.</p>
            <button onClick={() => push({ kind: "info", title: "Added to notify list" })} className="focus-ring mt-3 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink">
              Notify me when this launches
            </button>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-panel p-5">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <ShoppingBag size={15} /> Premium VODs &amp; series
            </h3>
            <p className="text-xs text-ink-muted">
              Already live: set any VOD&apos;s visibility to &ldquo;Subscribers&rdquo; from{" "}
              <Link href="/dashboard/content" className="text-brand-cyan underline">
                Content
              </Link>{" "}
              to build a paid VOD collection or premium series today.
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <LinkIcon size={15} /> Affiliate &amp; merch links
          </h2>
          <div className="space-y-2">
            {links.map((l, i) => (
              <div key={l.id} className="flex gap-2">
                <input
                  value={l.label}
                  onChange={(e) => setLinks((prev) => prev.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))}
                  className="focus-ring w-40 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none"
                />
                <input
                  value={l.url}
                  onChange={(e) => setLinks((prev) => prev.map((x, xi) => (xi === i ? { ...x, url: e.target.value } : x)))}
                  className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none"
                />
                <button
                  onClick={() => setLinks((prev) => prev.filter((x) => x.id !== l.id))}
                  className="focus-ring rounded-md border border-surface-border px-2.5 text-xs text-ink-muted hover:text-brand-red"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setLinks((prev) => [...prev, { id: `${Date.now()}`, label: "", url: "" }])}
            className="focus-ring mt-2 text-xs text-brand-cyan hover:underline"
          >
            + Add link
          </button>
        </section>
      </div>
    );
  }

function AdvertisingTab({ push }: { push: Push }) {
    const [settings, setSettings] = useState(DEFAULT_AD_SETTINGS);

    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Megaphone size={15} /> Ad controls
          </h2>
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-sm text-ink">
              Ads enabled on my channel
              <input type="checkbox" checked={settings.adsEnabled} onChange={(e) => setSettings((s) => ({ ...s, adsEnabled: e.target.checked }))} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between text-sm text-ink">
              Only run ads when I manually trigger them
              <input
                type="checkbox"
                checked={settings.manualTriggerOnly}
                onChange={(e) => setSettings((s) => ({ ...s, manualTriggerOnly: e.target.checked }))}
                className="accent-brand-magenta"
              />
            </label>
            <label className="flex items-center justify-between text-sm text-ink">
              Subscribers see ads
              <input type="checkbox" checked={settings.subscribersSeeAds} onChange={(e) => setSettings((s) => ({ ...s, subscribersSeeAds: e.target.checked }))} className="accent-brand-magenta" />
            </label>
            <label className="flex items-center justify-between text-sm text-ink">
              Never interrupt key moments (finales, big reveals)
              <input
                type="checkbox"
                checked={settings.blockDuringKeyMoments}
                onChange={(e) => setSettings((s) => ({ ...s, blockDuringKeyMoments: e.target.checked }))}
                className="accent-brand-magenta"
              />
            </label>
            <div className="flex items-center justify-between text-sm text-ink">
              Maximum ads per hour
              <select
                value={settings.maxAdsPerHour}
                onChange={(e) => setSettings((s) => ({ ...s, maxAdsPerHour: Number(e.target.value) }))}
                className="rounded border border-surface-border bg-surface-raised px-1.5 py-1 text-xs"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            {settings.manualTriggerOnly
              ? "Mid-roll ads will never auto-interrupt your stream — you trigger every break from Stream Manager."
              : "Automatic mid-roll ads are enabled and will play up to your hourly maximum."}
          </p>
          <button onClick={() => push({ kind: "success", title: "Ad settings saved" })} className="focus-ring mt-3 rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            Save ad settings
          </button>
        </section>

        <section className="rounded-lg border border-surface-border bg-surface-panel p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Radio size={15} /> Ad revenue log
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="py-1.5">Triggered</th>
                <th className="py-1.5">Duration</th>
                <th className="py-1.5">Type</th>
                <th className="py-1.5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {AD_REVENUE_LOG.map((a) => (
                <tr key={a.id}>
                  <td className="py-1.5 text-ink-muted">{formatRelativeTime(a.triggeredAt)}</td>
                  <td className="py-1.5 text-ink-muted">{a.durationSeconds}s</td>
                  <td className="py-1.5 text-ink-muted capitalize">{a.trigger}</td>
                  <td className="py-1.5 text-right font-medium text-ink">{formatCurrency(a.estimatedRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
}

function sum(rows: typeof STREAM_REVENUE, key: "subscriptions" | "tips" | "giftedSubs" | "ads"): number {
  return rows.reduce((n, r) => n + r[key], 0);
}
