"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="mt-1 text-muted">{project.description}</p>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 text-sm font-bold text-accent"
            >
              Watch demo
            </a>
          )}
        </div>
        <span className="whitespace-nowrap rounded-full bg-bg px-2.5 py-1.5 text-xs font-extrabold text-accent">
          {project.tag}
        </span>
      </div>

      <ul className="mb-5 grid gap-2 text-sm text-text">
        {project.achievements.map((achievement) => (
          <li key={achievement} className="grid grid-cols-[8px_1fr] items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="inline-flex h-8 items-center rounded-full bg-bg px-2.5 text-xs font-bold text-text"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
