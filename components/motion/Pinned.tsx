"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";
import { DURATION, EASE } from "@/lib/motion";
import { scrollToY } from "@/lib/scrollControl";

/**
 * Holds a section in place while its beats advance with the scroll. Without
 * motion it degrades to the beats stacked vertically, which is a perfectly
 * good layout — the pin is an enhancement, not the structure.
 *
 * The beats only overlap (a single-cell grid, each wrapper pinned to that
 * cell) while `animate` is true. That overlap is driven from React state, not
 * from GSAP, so a visitor without motion — or before the client has measured
 * — always gets plain stacked flow.
 */
export function Pinned({
  beats,
  className = "",
}: {
  beats: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);

    // Read by the focusin handlers below; updated from ScrollTrigger's
    // onUpdate so only the beat currently on screen can be focused or
    // clicked — the others sit behind it in the same grid cell.
    let activeIndex = 0;
    const removeListeners: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-beat]", el);

      try {
        gsap.set(items, { opacity: 0, y: 40 });
        gsap.set(items[0], { opacity: 1, y: 0 });
        items.forEach((item, index) => {
          item.style.pointerEvents = index === 0 ? "auto" : "none";
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // One viewport of scroll per transition, so the pin releases as soon
            // as the beats are done. It borrows scroll; it never keeps it.
            end: () => `+=${window.innerHeight * (items.length - 1)}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const next = Math.round(self.progress * (items.length - 1));
              if (next === activeIndex) return;
              activeIndex = next;
              items.forEach((item, index) => {
                item.style.pointerEvents = index === activeIndex ? "auto" : "none";
              });
            },
          },
        });

        items.forEach((item, index) => {
          if (index === 0) return;
          timeline
            .to(items[index - 1], { opacity: 0, y: -40, duration: DURATION.section, ease: EASE.inOut })
            .to(item, { opacity: 1, y: 0, duration: DURATION.section, ease: EASE.inOut }, "<");
        });

        const trigger = timeline.scrollTrigger;

        // Keyboard: focus entering a beat drives the timeline to that beat
        // instead of the browser scrolling inside a pinned container.
        items.forEach((item, index) => {
          const handleFocusIn = () => {
            // Already the visible beat: don't jump the scroll under a click
            // on a link that lives inside it.
            if (index === activeIndex) return;
            if (!trigger) return;
            const span = trigger.end - trigger.start;
            const target = trigger.start + (span * index) / Math.max(1, items.length - 1);
            scrollToY(target);
          };
          item.addEventListener("focusin", handleFocusIn);
          removeListeners.push(() => item.removeEventListener("focusin", handleFocusIn));
        });
      } catch (error) {
        // A pinned section that fails must still be readable: every beat
        // visible, in place, and clickable.
        gsap.set(items, { opacity: 1, y: 0 });
        items.forEach((item) => {
          item.style.pointerEvents = "auto";
        });
        console.error("Pinned setup failed; showing beats unanimated.", error);
      }
    }, el);

    return () => {
      // ctx.revert() undoes GSAP tweens and ScrollTriggers, but it does not
      // remove listeners added with addEventListener, nor the inline
      // pointer-events this effect wrote directly to the DOM (outside GSAP,
      // so revert never sees them) — both are torn down here explicitly, on
      // every unmount and every change of `animate`.
      ctx.revert();
      removeListeners.forEach((remove) => remove());
      const items = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
      items.forEach((item) => {
        item.style.pointerEvents = "";
      });
    };
  }, [animate]);

  const containerClassName = [animate ? "grid" : "flex flex-col gap-16", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={containerClassName}>
      {beats.map((beat, index) => (
        <div key={index} data-beat className={animate ? "[grid-area:1/1]" : ""}>
          {beat}
        </div>
      ))}
    </div>
  );
}
