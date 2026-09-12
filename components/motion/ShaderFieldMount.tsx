"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const ShaderField = dynamic(() => import("./ShaderField"), { ssr: false });

/**
 * Isolates the shader from the rest of the page. A failed dynamic import
 * (the chunk blocked or a bad deploy) throws during render, and React error
 * boundaries must be class components — there is no hook equivalent.
 * Rendering null on error keeps the background simply absent instead of
 * surfacing Next's crash screen over the whole page.
 */
class ShaderFieldBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ShaderField failed to load; continuing without the background.", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

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
  return (
    <ShaderFieldBoundary>
      <ShaderField className={className} />
    </ShaderFieldBoundary>
  );
}
