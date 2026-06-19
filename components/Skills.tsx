"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { skillCategories } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
            <span className="text-muted">04</span>
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            Skills
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Stack organized for full-stack delivery.
          </h2>
          <p className="mt-3 text-lg text-muted">
            A practical toolkit spanning backend services, frontend interfaces, databases,
            deployment, collaboration, and agile delivery.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <motion.div
              key={category.name}
              variants={revealItemVariants}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="mb-4 text-lg font-semibold">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex h-8 items-center rounded-full bg-bg px-3 text-xs font-bold text-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
