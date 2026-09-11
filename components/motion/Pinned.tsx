"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";
import { DURATION, EASE } from "@/lib/motion";
import { scrollToY } from "@/lib/scrollControl";
import {
  hashTargetId,
  initialHashReapplyState,
  isHashReapplyDone,
  shouldReapplyOnRefresh,
} from "@/lib/deepLinkHash";

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
  footer,
}: {
  beats: ReactNode[];
  className?: string;
  /**
   * Rendered inside the stage after the beats, in both the animated stage
   * and the stacked fallback — never overlapped by the beat-swap animation.
   * Keeping it inside the pinned box (rather than after `<Pinned>`) means it
   * scrolls in with whichever beat is active and leaves no gap once the pin
   * releases.
   */
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();
  // Drives the overlapping-grid layout off, in React, when GSAP setup throws
  // partway through — the grid-area classes are what make a failed setup
  // pile every beat into the same cell, so only removing them (not just
  // resetting opacity/pointer-events) leaves a readable page.
  const [setupFailed, setSetupFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    setSetupFailed(false);
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

        // Deep links to sections after Pulse (I4): the browser's own anchor
        // jump ran against the server layout, before this pin existed above
        // them. Re-apply the hash once ScrollTrigger has recalculated that
        // spacing — see lib/deepLinkHash for exactly how long this keeps
        // trying — until the visitor scrolls under their own power.
        const targetId = hashTargetId(window.location.hash);
        const targetEl = targetId ? document.getElementById(targetId) : null;
        if (targetEl) {
          const hashState = initialHashReapplyState();
          hashState.pageLoaded = document.readyState === "complete";
          const scrollIntentEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
          let hashListenersRemoved = false;

          // Mutually referencing consts, all declared before any of them can
          // possibly run (they're only ever called later, from an event) —
          // no temporal-dead-zone issue, and it keeps every function
          // declaration at the top level `no-inner-declarations` wants.
          const onScrollIntent = () => {
            hashState.hasScrollIntent = true;
            removeHashListeners();
          };

          const onLoad = () => {
            hashState.pageLoaded = true;
          };

          const onRefresh = () => {
            if (!shouldReapplyOnRefresh(hashState)) return;
            targetEl.scrollIntoView({ block: "start" });
            if (hashState.pageLoaded) hashState.refreshesAfterLoad += 1;
            if (isHashReapplyDone(hashState)) removeHashListeners();
          };

          const removeHashListeners = () => {
            if (hashListenersRemoved) return;
            hashListenersRemoved = true;
            scrollIntentEvents.forEach((type) => window.removeEventListener(type, onScrollIntent));
            window.removeEventListener("load", onLoad);
            ScrollTrigger.removeEventListener("refresh", onRefresh);
          };

          scrollIntentEvents.forEach((type) => window.addEventListener(type, onScrollIntent, { passive: true }));
          if (!hashState.pageLoaded) window.addEventListener("load", onLoad, { once: true });
          ScrollTrigger.addEventListener("refresh", onRefresh);

          removeListeners.push(removeHashListeners);
        }
      } catch (error) {
        // A pinned section that fails must still be readable: every beat
        // visible, in place, and clickable — the same stacked layout the
        // no-motion path already uses, not beats piled into one grid cell.
        // A throw partway through setup can leave a tween already running
        // against these targets (e.g. the timeline built before the failure);
        // left alive, its next tick re-applies the hidden values on top of
        // the `set` below. Kill it first so this restore is the last word.
        gsap.killTweensOf(items);
        gsap.set(items, { opacity: 1, y: 0 });
        items.forEach((item) => {
          item.style.pointerEvents = "auto";
        });
        setSetupFailed(true);
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
      setSetupFailed(false);
    };
  }, [animate]);

  // A failed setup falls all the way back to the same stacked layout as
  // no-motion — including skipping the viewport-height stage from I3, which
  // exists to hold the pin's centred beat, not a plain flow of them.
  const pinnedLayout = animate && !setupFailed;

  // While animating, the stage fills the viewport (min-h-svh) and clears the
  // collapsed header (pt-12 = 3rem) so the active beat never renders
  // partially underneath it; the beats-wrapper grows to fill what's left
  // (flex-1) and centres the beat group inside that space. The stacked
  // fallback keeps today's plain flow — no viewport-height stage.
  const containerClassName = [
    "flex flex-col gap-16",
    pinnedLayout ? "min-h-svh pt-12" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // display:contents in the stacked fallback makes this wrapper invisible to
  // layout, so each beat becomes a direct flex item sharing the container's
  // own gap-16 — identical spacing to before footer existed.
  const beatsWrapperClassName = pinnedLayout ? "grid flex-1 place-content-center" : "contents";

  return (
    <div ref={ref} className={containerClassName}>
      <div className={beatsWrapperClassName}>
        {beats.map((beat, index) => (
          <div key={index} data-beat className={pinnedLayout ? "[grid-area:1/1]" : ""}>
            {beat}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}
