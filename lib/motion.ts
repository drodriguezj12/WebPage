/**
 * Every duration and curve on the site comes from here. One hand moves
 * everything, so nothing drifts out of rhythm as sections are added.
 * Values are in seconds because GSAP takes seconds.
 */
export const DURATION = {
  /** Interface feedback: hover, press, focus. */
  feedback: 0.24,
  /** A single element entering or leaving. */
  element: 0.6,
  /** Section-scale movement: wipes, pinned beats. */
  section: 0.8,
} as const;

export const EASE = {
  /** Slow exit. The curve that makes movement read as deliberate. */
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

/**
 * Step between siblings so a group of any size finishes in `total` seconds.
 * A fixed per-item delay would make a twelve-item grid crawl.
 */
export function stagger(count: number, total = 0.4): number {
  if (count <= 0) return 0;
  if (count === 1) return total;
  return total / count;
}
