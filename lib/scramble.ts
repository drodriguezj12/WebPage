const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-_";

/**
 * One frame of a left-to-right settle: the first `progress` share of the
 * characters have arrived, the rest are still noise.
 *
 * The substitute character is injected so the function stays pure and the
 * tests stay deterministic; in the browser it is random.
 */
export function scrambleFrame(
  target: string,
  progress: number,
  pick: (index: number) => string = () =>
    GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
): string {
  const clamped = Math.min(1, Math.max(0, progress));
  const settled = Math.round(target.length * clamped);

  let out = "";
  for (let i = 0; i < target.length; i += 1) {
    // A scrambled space would make the label visibly jitter in width.
    if (i < settled || target[i] === " ") {
      out += target[i];
    } else {
      out += pick(i);
    }
  }
  return out;
}
