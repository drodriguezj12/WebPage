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
          // GSAP animates `y` through `transform`, but also writes an inline
          // `translate: none` alongside it (its guard against the independent
          // CSS `translate`/`rotate`/`scale` properties stacking on top of the
          // transform matrix). Left in place, that inline style outranks any
          // stylesheet rule on `translate` — including a card's hover lift —
          // for good. Once the entry is done there is nothing left to guard
          // against, so clear it and hand `translate` back to CSS.
          clearProps: "translate,rotate,scale",
        });
      } catch (error) {
        // A sequence that never animates is a flaw; one that stays hidden
        // is a broken page. Visible always wins — but a throw inside the
        // `gsap.to` call above can leave that tween half-built and still
        // running, and its next tick would reapply the hidden values over
        // this restore. Kill it first.
        gsap.killTweensOf(items);
        gsap.set(items, { opacity: 1, y: 0, clearProps: "translate,rotate,scale" });
        console.error("Stagger reveal failed; showing items unanimated.", error);
      }
    }, el);

    return () => {
      ctx.revert();
      // revert() alone can leave the entry's hidden inline values in place —
      // e.g. reduced motion switching on mid-session, after this group has
      // already revealed — so clear exactly the properties this effect ever
      // touches. Never "all": these children can carry other inline styles
      // (a React-set `display`, for instance) that must survive.
      gsap.set(el.children, { clearProps: "transform,translate,rotate,scale,opacity" });
    };
  }, [animate, total]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
