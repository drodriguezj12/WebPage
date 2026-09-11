/**
 * Every duration and curve on the site comes from here. One hand moves
 * everything, so nothing drifts out of rhythm as sections are added.
 * Values are in seconds because GSAP takes seconds.
 */
export const DURATION = {
  /** Interface feedback: hover, press, focus. */
  feedback: 0.24,
  /** Pointer tracking: the longest an interface response may take. */
  follow: 0.3,
  /** A single element entering or leaving. */
  element: 0.6,
  /** Section-scale movement: pinned beats. */
  section: 0.8,
} as const;

export const EASE = {
  /** Slow exit. The curve that makes movement read as deliberate. */
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

/**
 * CSS equivalents of `EASE`, for the handful of reveals that must run as
 * plain `@keyframes` (no JavaScript, so no GSAP easing string) — the Cover's
 * first-screen reveal, which has to be visible from first paint. `out` below
 * is the standard cubic-bezier approximation of GSAP's `power3.out`.
 */
export const CSS_EASE = {
  out: "cubic-bezier(0.215, 0.61, 0.355, 1)",
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
