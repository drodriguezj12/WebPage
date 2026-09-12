"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrambleFrame } from "@/lib/scramble";
import { DURATION, EASE } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * A mono label that settles into place. The finished text is rendered on the
 * server, so with JavaScript off — or reduced motion on — the label is simply
 * there.
 */
export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const state = { progress: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        duration: DURATION.element,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = scrambleFrame(text, state.progress);
        },
        onComplete: () => {
          el.textContent = text;
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, [text, animate]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
