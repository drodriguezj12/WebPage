"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * The product-page move: media starts as a window in the middle of the screen
 * and grows to fill it as the page scrolls, while the caption above it lifts
 * away.
 *
 * The tall track and the sticky viewport are CSS (`.stage-track` /
 * `.stage-sticky`, desktop and motion-allowed only), so on a phone, without
 * JavaScript, or with reduced motion this is an ordinary block: caption, then
 * media at full size.
 */
export function ScaleStage({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const track = trackRef.current;
    const media = mediaRef.current;
    const captionEl = captionRef.current;
    if (!track || !media || !captionEl || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
      timeline
        .fromTo(media, { scale: 0.6, yPercent: 20 }, { scale: 1, yPercent: 0 }, 0)
        .fromTo(captionEl, { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: -40, duration: 0.45 }, 0);
    });

    return () => mm.revert();
  }, [animate]);

  return (
    <div ref={trackRef} className="stage-track">
      <div className="stage-sticky flex flex-col items-center justify-center gap-10 overflow-hidden px-4 py-16 md:px-8 lg:gap-0 lg:py-0">
        <div ref={captionRef} className="lg:absolute lg:inset-x-0 lg:top-[12vh] lg:z-10">
          {caption}
        </div>
        <div ref={mediaRef} className="w-full max-w-[1500px] will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}
