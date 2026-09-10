"use client";

import { useEffect, useState } from "react";

export type MotionAllowance = {
  /** False when the visitor asked for reduced motion. */
  animate: boolean;
  /** Also false on touch devices: the shader and the cursor cost battery. */
  heavy: boolean;
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const COARSE = "(pointer: coarse)";

/**
 * The single place the two opt-out conditions are read. Components ask this
 * hook rather than matching media queries themselves, so the rule cannot drift
 * apart across the codebase.
 *
 * Starts pessimistic — no animation until the client has measured — so the
 * server render and the first paint never show motion that must then be undone.
 */
export function useMotionAllowed(): MotionAllowance {
  const [allowance, setAllowance] = useState<MotionAllowance>({
    animate: false,
    heavy: false,
  });

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED);
    const coarse = window.matchMedia(COARSE);

    const read = () =>
      setAllowance({
        animate: !reduced.matches,
        heavy: !reduced.matches && !coarse.matches,
      });

    read();
    reduced.addEventListener("change", read);
    coarse.addEventListener("change", read);
    return () => {
      reduced.removeEventListener("change", read);
      coarse.removeEventListener("change", read);
    };
  }, []);

  return allowance;
}
