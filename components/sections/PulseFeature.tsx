import Image from "next/image";
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { Pinned } from "@/components/motion/Pinned";
import { VideoEmbed } from "@/components/VideoEmbed";

export function PulseFeature() {
  const pulse = projects[0];

  return (
    <section id="pulse" className="relative border-t border-border py-24">
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-40"
      />
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader
          index="01"
          label="Featured"
          lines={["Pulse —", "real time,", "end to end"]}
        />

        <Pinned
          className="relative"
          footer={
            <div className="flex flex-wrap gap-4">
              {pulse.repoUrl ? (
                <a
                  className="label border border-border px-5 py-4 hover:border-steel hover:text-steel focus-visible:text-steel focus-visible:border-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
                  href={pulse.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View code on GitHub
                </a>
              ) : null}
              {pulse.demoUrl ? (
                <a
                  className="label border border-border px-5 py-4 hover:border-steel hover:text-steel focus-visible:text-steel focus-visible:border-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
                  href={pulse.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch the demo
                </a>
              ) : null}
            </div>
          }
          beats={[
            <div key="what" className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="max-w-[46ch] text-lg leading-relaxed text-muted">
                  {pulse.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {pulse.tech.map((tech) => (
                    <li key={tech} className="label border border-border px-3 py-2">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {pulse.screenshots ? (
                <div
                  // Real in-browser viewports (screen minus browser chrome)
                  // can be shorter than this beat's natural height at any
                  // width, most often on a laptop's own display — a phone
                  // held short of its usual height doesn't have the column
                  // width to keep the screenshots readable next to the copy
                  // in the first place, so the whole block steps aside there.
                  //
                  // The height-aware rules for `pulse-*` below live in
                  // globals.css, scoped to `[data-pinned] .pulse-*` — set by
                  // Pinned itself only on its animated, pinned rendering, so
                  // the reduced-motion/no-JS stacked fallback (no
                  // one-screen budget to protect) renders exactly as it
                  // always has. Plain hand-written CSS, not Tailwind's
                  // arbitrary-variant syntax: stacking an arbitrary
                  // ancestor-selector variant with an arbitrary media
                  // variant silently dropped the height condition (or the
                  // whole class) in this Tailwind version.
                  className="pulse-screenshots grid grid-cols-2 gap-3"
                >
                  <figure className="col-span-2">
                    <div className="border border-border">
                      <Image
                        src={pulse.screenshots[0].src}
                        alt={pulse.screenshots[0].alt}
                        width={pulse.screenshots[0].width}
                        height={pulse.screenshots[0].height}
                        sizes="(min-width: 1440px) 680px, (min-width: 1024px) calc(50vw - 40px), 100vw"
                        loading="lazy"
                        // Below ~800px of inner height the full-height hero
                        // shot is what pushes the beat past the fold; capping
                        // it (cropped to its top, where the feed content is)
                        // buys back most of that without losing the image.
                        className="pulse-hero-shot h-auto w-full"
                      />
                    </div>
                    <figcaption className="label mt-2 block">
                      {pulse.screenshots[0].label}
                    </figcaption>
                  </figure>
                  {pulse.screenshots.slice(1).map((shot) => (
                    <figure
                      key={shot.src}
                      // The two supporting shots are the next thing to give
                      // up: below ~700px of inner height, capping the hero
                      // shot alone isn't enough to clear the fold.
                      className="pulse-supporting-shot hidden lg:block"
                    >
                      <div className="border border-border">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          sizes="304px"
                          loading="lazy"
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className="label mt-2 block">{shot.label}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>,

            <div
              key="demo"
              // The video keeps a 16:9 ratio at whatever width this wrapper
              // gives it, so its rendered height scales with max-w-3xl (768px
              // wide -> 432px tall) — tall enough that it, not the screenshots
              // beat, is what actually sizes the shared grid cell every beat
              // sits in. Narrowing the cap on short viewports (pulse-demo-wrapper
              // in globals.css) shrinks that cell along with it.
              className="pulse-demo-wrapper mx-auto w-full max-w-3xl"
            >
              {pulse.demoUrl ? (
                <VideoEmbed url={pulse.demoUrl} title={pulse.title} />
              ) : null}
            </div>,

            <div key="decisions" className="pulse-decisions grid gap-8 md:grid-cols-3">
              {pulse.achievements.slice(1, 4).map((achievement, index) => (
                <div key={achievement}>
                  <span className="label block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pulse-decision-text mt-4 text-base leading-relaxed text-muted">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>,
          ]}
        />
      </div>
    </section>
  );
}
