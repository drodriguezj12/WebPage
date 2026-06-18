"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const shouldEnable = !prefersReducedMotion && !isTouchDevice;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabled(shouldEnable);

    if (!shouldEnable) {
      return;
    }

    document.body.style.cursor = "none";

    function handleMove(event: PointerEvent) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      const target = event.target as HTMLElement;
      setIsPointer(Boolean(target.closest("a, button, [data-cursor-pointer]")));
    }

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.body.style.cursor = "";
    };
  }, [cursorX, cursorY]);

  if (!isEnabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-accent mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: isPointer ? 48 : 16,
        height: isPointer ? 48 : 16,
        backgroundColor: isPointer ? "rgba(255,106,61,0.15)" : "rgba(255,106,61,0.6)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}
