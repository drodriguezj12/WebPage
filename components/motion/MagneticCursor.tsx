"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A ring that follows the pointer and is pulled toward interactive elements.
 * It never replaces the real focus ring, and it never appears on touch.
 */
export function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { heavy } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !heavy) return;

    // quickTo keeps one tween alive instead of creating one per pointer event.
    const moveX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    document.body.style.cursor = "none";

    function onMove(event: PointerEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);

      if (target) {
        // Pull toward the element's centre rather than sitting on the pointer.
        const box = target.getBoundingClientRect();
        moveX(box.left + box.width / 2);
        moveY(box.top + box.height / 2);
        gsap.to(el, { scale: 2.4, opacity: 0.55, duration: 0.24, ease: "power3.out" });
      } else {
        moveX(event.clientX);
        moveY(event.clientY);
        gsap.to(el, { scale: 1, opacity: 1, duration: 0.24, ease: "power3.out" });
      }
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.style.cursor = "";
      gsap.killTweensOf(el);
    };
  }, [heavy]);

  if (!heavy) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-steel mix-blend-difference"
    />
  );
}
