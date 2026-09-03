// A restrained arcade-cabinet bezel: metal frame, a marquee light strip, and
// corner bolts. Wraps a "screen" (the actual player/preview surface) rather
// than being a screen itself, so the video content stays fully readable.
export function CabinetFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#232329] to-[#0c0c0f] p-2.5 shadow-card ring-1 ring-black/50 sm:p-3.5">
      <div
        aria-hidden
        className="relative mb-2.5 flex h-4 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple px-3 shadow-glow sm:mb-3 sm:h-5"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="h-1 w-1 shrink-0 rounded-full bg-white/85" />
        ))}
      </div>

      <CornerBolt className="left-1.5 top-6 sm:left-2 sm:top-7" />
      <CornerBolt className="right-1.5 top-6 sm:right-2 sm:top-7" />
      <CornerBolt className="bottom-1.5 left-1.5 sm:bottom-2 sm:left-2" />
      <CornerBolt className="bottom-1.5 right-1.5 sm:bottom-2 sm:right-2" />

      {children}
    </div>
  );
}

function CornerBolt({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-10 h-2 w-2 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.9)] sm:h-2.5 sm:w-2.5 ${className}`}
      style={{ background: "radial-gradient(circle at 35% 35%, #8a8a98, #1a1a1f 70%)" }}
    />
  );
}
