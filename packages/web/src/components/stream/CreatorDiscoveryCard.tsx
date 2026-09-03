import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { getCreatorById } from "@/lib/mock-data";

export function CreatorDiscoveryCard({ creatorId, reason }: { creatorId: string; reason: string }) {
  const creator = getCreatorById(creatorId);
  if (!creator) return null;

  return (
    <Link
      href={`/channel/${creator.username}`}
      className="focus-ring block rounded-lg border border-surface-border bg-surface-panel p-4 transition hover:border-surface-borderStrong"
    >
      <div className="flex items-center gap-3">
        <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{creator.displayName}</p>
          <p className="truncate text-xs text-ink-faint">{creator.category}</p>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-xs text-brand-cyan">
        <TrendingUp size={13} className="mt-0.5 shrink-0" />
        {reason}
      </p>
    </Link>
  );
}
