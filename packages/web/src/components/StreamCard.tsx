import Link from "next/link";
import type { StreamCardData } from "@/lib/types";

const GRADIENTS = [
  "from-arcade-magenta/60 to-arcade-panel2",
  "from-arcade-cyan/50 to-arcade-panel2",
  "from-arcade-orange/50 to-arcade-panel2",
  "from-arcade-green/40 to-arcade-panel2"
];

export function StreamCard({ stream }: { stream: StreamCardData }) {
  const gradient = GRADIENTS[stream.thumbnailSeed % GRADIENTS.length];

  return (
    <Link
      href={`/${stream.channel.username}`}
      className="group block overflow-hidden rounded-lg border-2 border-arcade-border bg-arcade-panel transition hover:-translate-y-1 hover:border-arcade-cyan hover:shadow-cabinet"
    >
      <div className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="font-pixel text-3xl opacity-30">{stream.category?.emoji ?? "🕹️"}</span>
        {stream.isLive && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 font-pixel text-[10px] text-white shadow-neon">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 font-mono text-xs text-arcade-yellow">
          {stream.viewerCount.toLocaleString()} watching
        </span>
      </div>
      <div className="p-3">
        <p className="truncate font-mono text-sm text-white group-hover:text-neon-cyan">{stream.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: stream.channel.avatarColor }} />
          <span className="truncate font-mono text-xs text-arcade-cyan/80">
            {stream.channel.displayName}
          </span>
          <span className="font-mono text-[10px] text-arcade-magenta">Lv.{stream.channel.level}</span>
        </div>
        {stream.category && (
          <p className="mt-1 font-mono text-[11px] text-arcade-yellow/70">{stream.category.name}</p>
        )}
      </div>
    </Link>
  );
}
