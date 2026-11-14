import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { EventDiagram } from "@/components/project/EventDiagram";
import { PointList, ProjectIntro, TechLine } from "@/components/project/parts";
import { smartpark } from "@/data/projects";

export function SmartParkSection() {
  return (
    <section
      id="smartpark"
      data-theme="dark"
      data-accent="park"
      aria-labelledby="smartpark-title"
      className="mx-2 rounded-[2rem] px-5 py-24 md:mx-4 md:rounded-[3rem] md:px-10 md:py-40"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div data-reveal id="smartpark-title">
              <ProjectIntro
                index={smartpark.index}
                kind={smartpark.kind}
                name={smartpark.name}
                tagline={smartpark.tagline}
              />
            </div>
            <p data-reveal className="lede mt-10 max-w-[50ch]">
              {smartpark.summary}
            </p>
          </div>

          <div data-reveal className="mx-auto w-full max-w-[520px] lg:col-span-5 lg:col-start-8">
            <EventDiagram />
          </div>
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
