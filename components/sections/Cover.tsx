import Link from "next/link";
import { projects } from "@/data/projects";
import { CountUp } from "@/components/motion/CountUp";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { ShaderFieldMount } from "@/components/motion/ShaderFieldMount";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger } from "@/components/motion/Stagger";

const FIGURES = [
  { figure: "3+", label: "Years shipping" },
  { figure: "30%", label: "Faster queries" },
  { figure: "95", label: "Tests on Pulse" },
];

export function Cover() {
  return (
    <section id="home" className="relative min-h-svh overflow-hidden pt-28 pb-16">
      <ShaderFieldMount className="pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label">
            <ScrambleText text="DANIEL RODRIGUEZ — BOGOTÁ, CO" />
          </p>
          <p className="label flex items-center gap-2">
            {/* The single use of `signal` on the page. */}
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            Available for work
          </p>
        </div>

        <SplitText
          as="h1"
          className="display text-[44px] md:text-[68px] lg:text-[96px] xl:text-[130px]"
          lines={[
            "Systems that",
            "hold up in",
            <span key="production" className="text-steel">
              production
            </span>,
          ]}
        />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[46ch] text-base leading-relaxed text-muted">
            Backend-leaning full-stack developer. Java, Spring Boot and PostgreSQL —
            three years building and optimising applications that run for real.
          </p>

          <Stagger className="flex gap-10">
            {FIGURES.map((item) => (
              <div key={item.label}>
                <CountUp figure={item.figure} className="display block text-[40px] text-steel" />
                <span className="label mt-2 block">{item.label}</span>
              </div>
            ))}
          </Stagger>
        </div>

        <Stagger className="grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <Link
              key={project.title}
              href="#work"
              className="group border-b border-border bg-bg py-6 pr-6 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
            >
              <span className="label block">{String(index + 1).padStart(2, "0")}</span>
              <span className="display mt-3 block text-[26px] group-hover:text-steel">
                {project.shortName ?? project.title}
              </span>
              <span className="label mt-2 block">{project.discipline}</span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
