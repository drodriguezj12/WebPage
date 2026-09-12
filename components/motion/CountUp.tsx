"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatFigure, parseFigure } from "@/lib/countUp";
import { DURATION, EASE } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

export function CountUp({
  figure,
  className = "",
}: {
  figure: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const parsed = parseFigure(figure);
    const state = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: parsed.value,
        duration: DURATION.section,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = formatFigure(state.value, parsed);
        },
        onComplete: () => {
          el.textContent = figure;
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = figure;
    };
  }, [figure, animate]);

  // The final value is the server-rendered content: no JavaScript, no problem.
  return (
    <span ref={ref} className={className}>
      {figure}
    </span>
  );
}
