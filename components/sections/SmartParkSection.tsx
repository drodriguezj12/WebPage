import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ParkingSim } from "@/components/project/ParkingSim";
import { PointList, ProjectIntro, TechLine } from "@/components/project/parts";
import { smartpark } from "@/data/projects";

export function SmartParkSection() {
  return (
    <section
      id="smartpark"
      data-theme="dark"
      data-accent="park"
      data-panel
      aria-labelledby="smartpark-title"
      className="mx-2 rounded-[2rem] px-5 py-24 md:mx-4 md:rounded-[3rem] md:px-10 md:py-40"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div data-reveal id="smartpark-title" className="lg:col-span-7">
            <ProjectIntro
              index={smartpark.index}
              kind={smartpark.kind}
              name={smartpark.name}
              tagline={smartpark.tagline}
            />
          </div>
          <p data-reveal className="lede lg:col-span-5">
            {smartpark.summary}
          </p>
        </div>

        <div data-reveal className="mt-16 border-t border-line pt-12 md:mt-24 md:pt-16">
          <ParkingSim />
          <p className="mt-10 max-w-[70ch] text-[0.8125rem] leading-relaxed text-faint">
            A model of the event flow, not the product itself: nothing here talks to a backend.
            The real dashboard is in the demo below.
          </p>
        </div>

        <div data-reveal className="frame mt-20 md:mt-32">
          <div className="frame-core">
            <YouTubeEmbed url={smartpark.demoUrl} title={smartpark.name} />
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <PointList points={smartpark.points} />
          <div data-reveal className="mt-10 border-t border-line pt-7">
            <TechLine tech={smartpark.tech} />
          </div>
        </div>
      </div>
    </section>
  );
}
