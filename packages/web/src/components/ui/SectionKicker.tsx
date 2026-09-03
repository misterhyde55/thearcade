// Small pixel-font label used above section headings — the "arcade detail",
// kept tiny and tracked-wide so it reads as a flourish, never as body copy.
export function SectionKicker({ children }: { children: React.ReactNode }) {
  return <p className="font-pixel mb-1.5 text-[9px] tracking-[0.2em] text-brand-cyan/80">{children}</p>;
}
