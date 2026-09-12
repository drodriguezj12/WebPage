"use client";

import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Renders nothing. Smooth scrolling is motion: a visitor who asked for reduced
 * motion gets the browser's own scrolling, untouched.
 */
export function SmoothScrollProvider() {
  const { animate } = useMotionAllowed();

  useEffect(() => {
    if (!animate) return;
    let teardown: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/smoothScroll").then(({ startSmoothScroll }) => {
      if (!cancelled) teardown = startSmoothScroll();
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [animate]);

  return null;
}
