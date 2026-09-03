import { Crown, Gem, Shield, Star, Tv } from "lucide-react";
import type { BadgeType } from "@/lib/types";

const BADGE_CONFIG: Record<BadgeType, { label: string; icon: typeof Crown; className: string }> = {
  creator: { label: "Creator", icon: Tv, className: "bg-brand-red/15 text-brand-red border-brand-red/30" },
  moderator: { label: "Moderator", icon: Shield, className: "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30" },
  founder: { label: "Founder", icon: Crown, className: "bg-amber-400/15 text-amber-400 border-amber-400/30" },
  subscriber: { label: "Subscriber", icon: Gem, className: "bg-brand-purple/15 text-brand-purple border-brand-purple/30" },
  vip: { label: "VIP", icon: Star, className: "bg-brand-magenta/15 text-brand-magenta border-brand-magenta/30" }
};

export function ChatBadge({ type }: { type: BadgeType }) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;
  return (
    <span
      title={config.label}
      className={`inline-flex h-4 w-4 items-center justify-center rounded border ${config.className}`}
    >
      <Icon size={10} aria-hidden />
      <span className="sr-only">{config.label}</span>
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "live" | "brand" | "warning";
}) {
  const toneClass = {
    neutral: "border-surface-border bg-surface-panel2 text-ink-muted",
    live: "border-brand-red/40 bg-brand-red/10 text-brand-red",
    brand: "border-brand-magenta/40 bg-brand-magenta/10 text-brand-magenta",
    warning: "border-amber-400/40 bg-amber-400/10 text-amber-400"
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}
