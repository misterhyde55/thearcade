// Cheap early levels, steeper later - arcade "credits" feel.
export function levelForXp(xp: number): number {
  let level = 1;
  let threshold = 50;
  let remaining = xp;
  while (remaining >= threshold) {
    remaining -= threshold;
    level += 1;
    threshold = Math.round(threshold * 1.35);
  }
  return level;
}
