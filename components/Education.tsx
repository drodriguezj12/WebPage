"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { educationItems } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
            <span className="text-muted">03</span>
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            Education
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Academic foundation and language capability.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Systems engineering training supported by professional English studies and
            hands-on production development experience.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid max-w-3xl gap-4">
          {educationItems.map((item) => (
            <motion.div
              key={item.institution}
              variants={revealItemVariants}
              className="grid grid-cols-[44px_1fr] gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/30 bg-accent-soft text-accent">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m22 10-10-5-10 5 10 5 10-5Z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.institution}</h3>
                <p className="mt-1 text-muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
