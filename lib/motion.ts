/**
 * Durations and curves for scripted (GSAP-driven) animation, in seconds
 * because GSAP takes seconds. CSS transitions use the matching `--ease-*`
 * tokens declared in app/globals.css.
 */
export const DURATION = {
  /** Interface feedback: hover, press, focus. */
  feedback: 0.24,
  /** A single element entering or leaving. */
  element: 0.6,
  /** Section-scale movement. */
  section: 0.8,
} as const;

export const EASE = {
  /** Slow exit. The curve that makes movement read as deliberate. */
  out: "power3.out",
  inOut: "power2.inOut",
} as const;
