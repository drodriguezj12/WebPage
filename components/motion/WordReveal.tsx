"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * A paragraph that inks in word by word as it is scrolled through. The words
 * are fully visible in the markup; the dimmed starting state is applied by
 * script, so without JavaScript or with reduced motion it is plain text.
 */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [animate]);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, index) => (
        <span key={index} data-word>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
