import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

export function Work() {
  // Pulse has its own section; this grid is everything else.
  const rest = projects.slice(1);

  return (
    <section id="work" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="02" label="Selected work" lines={["Other", "systems"]} />
        <Stagger className="grid gap-6 lg:grid-cols-3" total={0.5}>
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
