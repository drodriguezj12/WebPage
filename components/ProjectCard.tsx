"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";
import { VideoEmbed } from "./VideoEmbed";

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
        </div>
        <span className="whitespace-nowrap rounded-full bg-bg px-2.5 py-1.5 text-xs font-extrabold text-accent">
          {project.tag}
        </span>
      </div>

      {project.demoUrl && <VideoEmbed url={project.demoUrl} title={project.title} />}

      <ul className="mb-5 mt-5 grid gap-2 text-sm text-text">
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

      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md border border-border px-3.5 text-sm font-bold text-text transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5z" />
          </svg>
          View code on GitHub
          <span className="sr-only">for {project.title}</span>
        </a>
      )}
    </motion.article>
  );
}
