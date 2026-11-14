"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatFigure, parseFigure } from "@/lib/countUp";
import { EASE } from "@/lib/motion";
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
        duration: 1.2,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
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
  // tabular-nums keeps the width steady while the digits run.
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {figure}
    </span>
  );
}
