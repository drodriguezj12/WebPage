"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, stagger } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Each line sits inside a clipping wrapper and starts below it, so the text
 * rises from behind an invisible edge instead of fading in. The mask is what
 * separates this from a generic reveal.
 */
export function SplitText({
  lines,
  as = "h2",
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const inner = el.querySelectorAll<HTMLElement>("[data-line-inner]");
      try {
        gsap.set(inner, { yPercent: 110 });
        gsap.to(inner, {
          yPercent: 0,
          duration: DURATION.section,
          ease: EASE.out,
          delay,
          stagger: stagger(inner.length, 0.35),
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      } catch (error) {
        // A headline that never animates is a flaw; one that stays hidden behind
        // its mask is a broken page. Visible always wins.
        gsap.set(inner, { yPercent: 0 });
        console.error("SplitText reveal failed; showing the headline unanimated.", error);
      }
    }, el);

    return () => ctx.revert();
  }, [animate, delay]);

  const children = lines.map((line, index) => (
    <span className="split-line" key={index}>
      <span data-line-inner style={{ display: "block" }}>
        {line}
      </span>
    </span>
  ));

  if (as === "h1") {
    return (
      <h1 ref={ref} className={className}>
        {children}
      </h1>
    );
  }

  if (as === "p") {
    return (
      <p ref={ref} className={className}>
        {children}
      </p>
    );
  }

  return (
    <h2 ref={ref} className={className}>
      {children}
    </h2>
  );
}
