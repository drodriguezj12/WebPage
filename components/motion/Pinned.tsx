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

        // General fallback, for any viewport: if whatever just received
        // focus still isn't fully on screen — under the fixed header, or
        // below the fold — release the pin and let the browser's own
        // scrollIntoView finish the job. Beats get a first chance below to
        // fix this the cheap way (jump the timeline to the right progress);
        // the footer has no beat index to jump to, so this is its only path,
        // and a beat whose own content still overflows after being made
        // active falls through to it too.
        // The fixed header is collapsed (48px, h-12) by the time any
        // pinned section is reachable at all — a visitor is well past the
        // 120px scroll-Y threshold that collapses it. Reading its *live*
        // height here instead would be worse, not more robust: the collapse
        // is React state set from a native "scroll" listener, so right after
        // one of this effect's own Lenis-driven jumps it can still measure
        // the pre-collapse 80px (h-20) for a frame or two, which would flag
        // an already-visible element as hidden under the header.
        const HEADER_HEIGHT = 48;
        const ensureVisible = (target: HTMLElement) => {
          if (!trigger) return;
          const rect = target.getBoundingClientRect();
          const fullyVisible = rect.top >= HEADER_HEIGHT - 0.5 && rect.bottom <= window.innerHeight + 0.5;
          if (fullyVisible) return;
          scrollToY(trigger.end);
          requestAnimationFrame(() => {
            target.scrollIntoView({ block: "nearest" });
          });
        };

        // Keyboard: focus entering a beat drives the timeline to that beat
        // instead of the browser scrolling inside a pinned container.
        items.forEach((item, index) => {
          const jumpToBeat = () => {
            // Already the visible beat: don't jump the scroll under a click
            // on a link that lives inside it.
            if (index === activeIndex || !trigger) return;
            const span = trigger.end - trigger.start;
            const dest = trigger.start + (span * index) / Math.max(1, items.length - 1);
            scrollToY(dest);
          };
          const handleFocusIn = (event: FocusEvent) => {
            jumpToBeat();
            // The first time focus ever reaches this section it isn't pinned
            // yet, so the browser treats the newly focused element as an
            // ordinary off-screen node and scrolls it into view itself,
            // racing the jump above. Re-assert the destination — reading
            // `activeIndex` fresh, in case that native scroll already moved
            // it — before checking whether the result is actually visible.
            requestAnimationFrame(() => {
              jumpToBeat();
              requestAnimationFrame(() => ensureVisible(event.target as HTMLElement));
            });
          };
          item.addEventListener("focusin", handleFocusIn);
          removeListeners.push(() => item.removeEventListener("focusin", handleFocusIn));
        });

        // Footer: rendered after the beats, inside the same pinned stage,
        // but outside the overlapping grid — it has no beat index, so the
        // fallback above is the only way it can ever bring itself on screen.
        // Read from the DOM (an extra child after the beats-wrapper) rather
        // than closing over the `footer` prop: that keeps this effect keyed
        // on `animate` alone, the same as the `beats` prop already is above.
        const footerEl = el.children.length > 1 ? (el.lastElementChild as HTMLElement) : null;
        if (footerEl) {
          const handleFooterFocusIn = (event: FocusEvent) => {
            requestAnimationFrame(() => ensureVisible(event.target as HTMLElement));
          };
          footerEl.addEventListener("focusin", handleFooterFocusIn);
          removeListeners.push(() => footerEl.removeEventListener("focusin", handleFooterFocusIn));
        }

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
      // revert() alone can leave a beat's hidden inline opacity/transform in
      // place — e.g. reduced motion switching on mid-session, after the pin
      // already advanced past beat 0. Clear only what this effect ever
      // touches, never "all".
      gsap.set(items, { clearProps: "transform,translate,rotate,scale,opacity" });
      setSetupFailed(false);
    };
  }, [animate]);

  // A failed setup falls all the way back to the same stacked layout as
  // no-motion — including skipping the viewport-height stage from I3, which
  // exists to hold the pin's centred beat, not a plain flow of them.
  const pinnedLayout = animate && !setupFailed;

  // While animating, the stage fills the viewport (min-h-svh) and clears the
  // collapsed header plus a 16px gutter (pt-16 = 4rem: 48px header + 16px air)
  // so the active beat never renders flush under it; pb-4 gives the footer
  // the same 16px of air above the viewport's own bottom edge instead of
  // sitting flush against it. The beats-wrapper grows to fill what's left
  // (flex-1) and centres the beat group inside that space.
  //
  // That centering is what real in-browser viewports (screen minus browser
  // chrome, routinely shorter than the CSS viewport a devtools size picker
  // shows) can't afford: forcing the stage to fill min-h-svh gives flex-1
  // extra space to distribute even once the beat's own content — plus the
  // header clearance, the footer and the gaps between them — is already
  // taller than what is left after the header. Below ~800px of inner height,
  // drop the floor and let the stage size to exactly what its content needs;
  // the composition above that stays the intentional, centred one. The
  // stacked fallback keeps today's plain flow — no viewport-height stage.
  const containerClassName = [
    "flex flex-col gap-16",
    pinnedLayout ? "min-h-svh pt-16 pb-4 [@media(max-height:800px)]:!min-h-0" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // display:contents in the stacked fallback makes this wrapper invisible to
  // layout, so each beat becomes a direct flex item sharing the container's
  // own gap-16 — identical spacing to before footer existed.
  const beatsWrapperClassName = pinnedLayout ? "grid flex-1 place-content-center" : "contents";

  return (
    // data-pinned lets a beat reach up to this state with a plain CSS
    // ancestor selector — e.g. PulseFeature's own height-aware rules —
    // without needing a client component (and its own copy of
    // useMotionAllowed, plus whatever data it closes over) just to read
    // this same flag.
    <div ref={ref} data-pinned={pinnedLayout || undefined} className={containerClassName}>
      <div className={beatsWrapperClassName}>
        {beats.map((beat, index) => (
          <div
            key={index}
            data-beat
            // self-center: every beat shares one grid cell sized to the
            // tallest of them, and grid's default align-items: stretch
            // otherwise leaves a shorter beat's content pinned to the top
            // of that shared cell instead of centred in it.
            className={pinnedLayout ? "[grid-area:1/1] self-center" : ""}
          >
            {beat}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}
