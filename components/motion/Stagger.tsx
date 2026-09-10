"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, stagger } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Sequenced entry for a group. Animates its direct children, so the caller
 * controls the grouping by markup rather than by prop.
 */
export function Stagger({
  children,
  className = "",
  total = 0.4,
}: {
  children: ReactNode;
  className?: string;
  total?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = Array.from(el.children) as HTMLElement[];
      try {
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: DURATION.element,
          ease: EASE.out,
          stagger: stagger(items.length, total),
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      } catch (error) {
        // A sequence that never animates is a flaw; one that stays hidden
        // is a broken page. Visible always wins.
        gsap.set(items, { opacity: 1, y: 0 });
        console.error("Stagger reveal failed; showing items unanimated.", error);
      }
    }, el);

    return () => ctx.revert();
  }, [animate, total]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
