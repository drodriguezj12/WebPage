import Image from "next/image";
import type { Project } from "@/data/projects";
import { VideoEmbed } from "./VideoEmbed";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col border border-border bg-surface p-8 transition-colors hover:border-steel/40">
      <div className="mb-6 flex items-start justify-between gap-6">
        <h3 className="display text-[28px]">{project.title}</h3>
        <span className="label whitespace-nowrap">{project.discipline ?? project.tag}</span>
      </div>

      {project.cover ? (
        <Image
          src={project.cover}
          alt=""
          width={1200}
          height={675}
          className="mb-6 h-auto w-full border border-border"
        />
      ) : null}

      <p className="mb-6 max-w-[46ch] text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      {project.demoUrl ? <VideoEmbed url={project.demoUrl} title={project.title} /> : null}

      <ul className="mb-6 mt-6 grid gap-3 text-sm leading-relaxed text-muted">
        {project.achievements.map((achievement) => (
          <li key={achievement} className="grid grid-cols-[10px_1fr] gap-3">
            <span aria-hidden="true" className="mt-2 h-px w-2.5 bg-steel" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="label border border-border px-2.5 py-1.5">
            {tech}
          </span>
        ))}
      </div>

      {project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-6 w-fit border border-border px-4 py-3 hover:border-steel hover:text-steel focus-visible:text-steel focus-visible:border-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
        >
          View code on GitHub
        </a>
      ) : null}
    </article>
  );
}
