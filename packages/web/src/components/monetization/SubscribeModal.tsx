"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Gift, Crown, CircleDollarSign } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/format";
import type { Creator } from "@/lib/types";

type Tab = "subscribe" | "gift" | "tip";

export function SubscribeModal({ open, onClose, creator }: { open: boolean; onClose: () => void; creator: Creator }) {
  const [tab, setTab] = useState<Tab>("subscribe");
  const [selectedTierId, setSelectedTierId] = useState(creator.subscriptionTiers[0]?.id);
  const [tipAmount, setTipAmount] = useState(5);
  const { isSignedIn, isSubscribedTo, subscribeTo, cancelSubscription } = useDemoSession();
  const { push } = useToast();
  const router = useRouter();

  const selectedTier = creator.subscriptionTiers.find((t) => t.id === selectedTierId) ?? creator.subscriptionTiers[0];
  const subscribed = isSubscribedTo(creator.username);

  function requireSignIn() {
    onClose();
    push({ kind: "warning", title: "Sign in required", description: "Create a free account to subscribe or tip." });
    router.push("/login");
  }

  function confirmSubscribe() {
    if (!isSignedIn) return requireSignIn();
    if (!selectedTier) return;
    subscribeTo(creator.username, selectedTier.id);
    push({
      kind: "success",
      title: `Subscribed at ${selectedTier.name}`,
      description: "Demo subscription activated — no real payment was processed."
    });
    onClose();
  }

  function confirmGift() {
    if (!isSignedIn) return requireSignIn();
    push({ kind: "success", title: "Gift sub sent", description: "Demo gift delivered to a random viewer in chat — no real payment was processed." });
    onClose();
  }

  function confirmTip() {
    if (!isSignedIn) return requireSignIn();
    push({ kind: "success", title: `Tip of ${formatCurrency(tipAmount)} sent`, description: "Demo tip recorded — no real payment was processed." });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Support ${creator.displayName}`} maxWidthClassName="max-w-lg">
      <div className="mb-4 flex gap-1 rounded-md bg-surface-panel2 p-1">
        {(
          [
            { id: "subscribe", label: "Subscribe" },
            { id: "gift", label: "Gift a sub" },
            { id: "tip", label: "Send a tip" }
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-surface-panel text-ink shadow" : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "subscribe" && (
        <div className="space-y-3">
          {subscribed && (
            <div className="rounded-md border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-2 text-xs text-brand-cyan">
              You&apos;re currently subscribed. Changing tiers below updates your subscription.
            </div>
          )}
          {creator.subscriptionTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`block w-full rounded-lg border px-4 py-3 text-left ${
                selectedTierId === tier.id ? "border-brand-magenta bg-brand-magenta/[0.06]" : "border-surface-border hover:border-surface-borderStrong"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{tier.name}</span>
                <span className="text-sm font-semibold text-ink">{formatCurrency(tier.priceMonthly)}/mo</span>
              </div>
              {tier.isFoundingAvailable && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-400">
                  <Crown size={12} /> Founding member — {tier.foundingSlotsRemaining} slots left at this price forever
                </span>
              )}
              <ul className="mt-2 space-y-1">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs text-ink-muted">
                    <Check size={12} className="mt-0.5 shrink-0 text-brand-cyan" /> {p}
                  </li>
                ))}
              </ul>
            </button>
          ))}

          <div className="rounded-md border border-surface-border bg-surface-raised px-3 py-2.5 text-xs text-ink-muted">
            <p>
              <span className="font-medium text-ink">Creator-first split (proposed model):</span> 85% to {creator.displayName}, 15%
              platform fee. Payment processing fees (~2.9% + $0.30) are itemized separately and not part of the platform&apos;s cut.
            </p>
            <p className="mt-1">Cancel anytime — you keep perks through the end of the paid period. No refunds for partial months.</p>
          </div>

          <button
            onClick={confirmSubscribe}
            className="focus-ring w-full rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90"
          >
            {subscribed ? "Update subscription" : `Subscribe for ${selectedTier ? formatCurrency(selectedTier.priceMonthly) : ""}/mo`}
          </button>
          {subscribed && (
            <button
              onClick={() => {
                cancelSubscription(creator.username);
                push({ kind: "info", title: "Subscription cancelled", description: "You'll keep perks until the period ends." });
                onClose();
              }}
              className="focus-ring w-full rounded-md border border-surface-border py-2 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Cancel subscription
            </button>
          )}
        </div>
      )}

      {tab === "gift" && (
        <div className="space-y-3">
          <p className="text-sm text-ink-muted">Gift a subscription to a random active viewer in {creator.displayName}&apos;s chat.</p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 5, 10].map((count) => (
              <button key={count} className="focus-ring rounded-md border border-surface-border px-3 py-3 text-center hover:border-brand-magenta">
                <Gift size={16} className="mx-auto text-brand-magenta" />
                <p className="mt-1 text-sm font-semibold text-ink">{count}</p>
                <p className="text-[11px] text-ink-faint">{count === 1 ? "gift sub" : "gift subs"}</p>
              </button>
            ))}
          </div>
          <button onClick={confirmGift} className="focus-ring w-full rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            Send gift subs
          </button>
        </div>
      )}

      {tab === "tip" && (
        <div className="space-y-3">
          <p className="text-sm text-ink-muted">Tips go straight to {creator.displayName}, minus payment processing fees.</p>
          <div className="flex gap-2">
            {[2, 5, 10, 20].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                aria-pressed={tipAmount === amount}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                  tipAmount === amount ? "border-brand-magenta bg-brand-magenta/10 text-brand-magenta" : "border-surface-border text-ink-muted"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <button onClick={confirmTip} className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-magenta py-2.5 text-sm font-semibold text-white hover:bg-brand-magenta/90">
            <CircleDollarSign size={15} /> Send {formatCurrency(tipAmount)} tip
          </button>
        </div>
      )}
    </Modal>
  );
}
