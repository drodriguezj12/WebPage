"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  stagger = false,
}: RevealOnScrollProps) {
  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        // A stagger container wraps a whole grid, so it is often taller than the
        // viewport. A fractional amount is a share of the element, which such a
        // container can never reach on a short screen -- it would stay invisible
        // for good. "some" reveals it as soon as any part of it is on screen.
        viewport={{ once: true, amount: "some" }}
        transition={{ staggerChildren: 0.12, delayChildren: delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={revealItemVariants}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
