"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const ShaderField = dynamic(() => import("./ShaderField"), { ssr: false });

/**
 * Keeps OGL off the critical path. The shader is requested only after the
 * first paint has happened, and never at all on touch or reduced motion, so
 * the headline never waits on a background.
 */
export function ShaderFieldMount({ className = "" }: { className?: string }) {
  const { heavy } = useMotionAllowed();
  const [afterPaint, setAfterPaint] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setAfterPaint(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      if (inner) window.cancelAnimationFrame(inner);
    };
  }, []);

  if (!heavy || !afterPaint) return null;
  return <ShaderField className={className} />;
}
