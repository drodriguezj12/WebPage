"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Renders nothing. Wires the page's scroll-linked effects to elements that opt
 * in with an attribute, so the sections themselves stay server components:
 *
 * - `data-panel`  a dark section arrives narrower and opens to full width.
 * - `data-draw`   a line draws itself from the top as it is scrolled past.
 * - `data-fill`   display text fills with ink from left to right.
 *
 * Each effect animates a CSS custom property and the CSS in globals.css turns
 * it into a clip-path, a scale or a gradient. Without this script the
 * properties keep their defaults, which are the finished state.
 */
export function ScrollFx() {
  const { animate } = useMotionAllowed();

  useEffect(() => {
    if (!animate) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.fromTo(
            panel,
            { "--panel-inset": 11 },
            {
              "--panel-inset": 0,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "top 25%", scrub: true },
            },
          );
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line.parentElement,
              start: "top 70%",
              end: "bottom 65%",
              scrub: 0.4,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fill]").forEach((text) => {
        gsap.fromTo(
          text,
          { "--fill": 0 },
          {
            "--fill": 100,
            ease: "none",
            scrollTrigger: { trigger: text, start: "top 88%", end: "top 38%", scrub: 0.3 },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [animate]);

  return null;
}
