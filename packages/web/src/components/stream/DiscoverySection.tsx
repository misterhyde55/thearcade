import type { LucideIcon } from "lucide-react";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { DiscoveryCard } from "./DiscoveryCard";
import type { DiscoveryEntry } from "@/lib/types";

export function DiscoverySection({
  kicker,
  title,
  subtitle,
  icon: Icon,
  entries
}: {
  kicker: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  entries: DiscoveryEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionKicker>{kicker}</SectionKicker>
      <div className="mb-1 flex items-center gap-2">
        {Icon && <Icon size={17} className="text-brand-purple" />}
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
      </div>
      <p className="mb-4 text-sm text-ink-muted">{subtitle}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry) => (
          <DiscoveryCard key={entry.creatorId} entry={entry} />
        ))}
      </div>
    </section>
  );
}
