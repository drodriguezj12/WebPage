"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            Portfolio
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Selected projects with measurable engineering impact.
          </h2>
          <p className="mt-3 text-lg text-muted">
            A focused sample of full-stack platforms, backend services, real-time interfaces,
            and production-style infrastructure.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.title} variants={revealItemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
