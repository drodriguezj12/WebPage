"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/useReducedMotion";
import { DURATION, EASE } from "@/lib/motion";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A ring that follows the pointer and is pulled toward interactive elements.
 * It never replaces the real focus ring, and it never appears on touch.
 *
 * The native cursor stays visible everywhere. Hiding it costs precision and
 * the text I-beam, and links, buttons and inputs bring their own cursor back
 * regardless, so hiding it centrally only produced two cursors at once — the
 * ring is a follower accent, not a replacement.
 */
export function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { heavy } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !heavy) return;

    // GSAP owns this element's transform. Centring in CSS as well would make
    // the two fight, and the ring would trail the pointer by half its width.
    // Starts invisible: with no pointer position yet, the alternative is
    // sitting at (0,0) until the first move.
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

    // quickTo keeps one tween alive instead of creating one per pointer event.
    const moveX = gsap.quickTo(el, "x", { duration: DURATION.follow, ease: EASE.out });
    const moveY = gsap.quickTo(el, "y", { duration: DURATION.follow, ease: EASE.out });

    // Tracks whether the ring has a real position yet, so it can jump
    // straight there instead of easing in from wherever it last was.
    let hasMoved = false;

    function onMove(event: PointerEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);

      if (!hasMoved) {
        hasMoved = true;
        gsap.set(el, { x: event.clientX, y: event.clientY });
      }

      if (target) {
        // Pull toward the element's centre rather than sitting on the pointer.
        const box = target.getBoundingClientRect();
        moveX(box.left + box.width / 2);
        moveY(box.top + box.height / 2);
        gsap.to(el, { scale: 2.4, opacity: 0.55, duration: DURATION.feedback, ease: EASE.out });
      } else {
        moveX(event.clientX);
        moveY(event.clientY);
        gsap.to(el, { scale: 1, opacity: 1, duration: DURATION.feedback, ease: EASE.out });
      }
    }

    // Leaving the document means the pointer left the window; without this
    // the ring is left sitting at whatever edge it exited from. `mouseleave`
    // on `document` (unlike `mouseout`) does not bubble from children, so it
    // only fires for the window boundary itself.
    function onLeave() {
      hasMoved = false;
      gsap.to(el, { opacity: 0, duration: DURATION.feedback, ease: EASE.out });
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [heavy]);

  if (!heavy) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 rounded-full border border-steel mix-blend-difference"
    />
  );
}
