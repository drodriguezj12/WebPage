"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClipVideo } from "@/components/ClipVideo";
import type { Moment } from "@/data/projects";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * The project's moments as a strip that moves sideways while the page scrolls
 * down: the section holds still and the moments pass through it.
 *
 * The tall track, the sticky viewport and the horizontal row are CSS
 * (`.hscroll-*` in globals.css, desktop and motion-allowed only). Everywhere
 * else the same markup is an ordinary vertical stack.
 */
export function HorizontalMoments({ moments }: { moments: readonly Moment[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    const bar = barRef.current;
    if (!track || !row || !bar || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      timeline
        // Every panel is exactly one viewport of the row wide, so no measuring is needed.
        .to(row, { xPercent: -100 * (moments.length - 1) }, 0)
        .fromTo(bar, { scaleX: 1 / moments.length }, { scaleX: 1 }, 0);
    });

    return () => mm.revert();
  }, [animate, moments.length]);

  return (
    <div
      ref={trackRef}
      className="hscroll-track"
      style={{ "--n": moments.length } as CSSProperties}
    >
      <div className="hscroll-sticky">
        <div ref={rowRef} className="hscroll-row">
          {moments.map((moment, index) => (
            <article key={moment.title} className="hscroll-panel">
              <div className="mx-auto grid w-full max-w-[1280px] items-center gap-8 px-5 md:px-10 lg:grid-cols-12 lg:gap-12">
                <div data-reveal className="lg:col-span-4">
                  <p className="mono-label">
                    {String(index + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}
                  </p>
                  <h3 className="display-md mt-5">{moment.title}</h3>
                  <p className="lede mt-5">{moment.body}</p>
                </div>
                <div data-reveal className="frame lg:col-span-8">
                  <div className="frame-core">
                    <ClipVideo clip={moment.clip} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div aria-hidden="true" className="hscroll-progress">
          <span ref={barRef} />
        </div>
      </div>
    </div>
  );
}
