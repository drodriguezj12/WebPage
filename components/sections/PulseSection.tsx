import { ClipVideo } from "@/components/ClipVideo";
import { PillLink } from "@/components/PillLink";
import { ScaleStage } from "@/components/motion/ScaleStage";
import { PointList, ProjectIntro, TechLine } from "@/components/project/parts";
import { pulse } from "@/data/projects";

export function PulseSection() {
  return (
    <section
      id="pulse"
      data-theme="dark"
      data-accent="pulse"
      aria-labelledby="pulse-title"
      className="mx-2 rounded-[2rem] md:mx-4 md:rounded-[3rem]"
    >
      <span id="work" className="block" />

      <ScaleStage
        caption={
          <div className="px-5">
            <div id="pulse-title">
              <ProjectIntro
                index={pulse.index}
                kind={pulse.kind}
                name={pulse.name}
                tagline={pulse.tagline}
                center
              />
            </div>
          </div>
        }
      >
        <div className="frame">
          <div className="frame-core">
            <ClipVideo clip={pulse.hero} />
          </div>
        </div>
      </ScaleStage>

      <div className="mx-auto w-full max-w-[1280px] px-5 pb-24 md:px-10 md:pb-36">
        <div className="grid gap-10 py-16 md:py-28 lg:grid-cols-[1fr_auto] lg:items-end">
          <p data-reveal className="lede max-w-[52ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug text-fg">
            {pulse.summary}
          </p>
          <div data-reveal className="flex flex-wrap gap-3">
            <PillLink href={pulse.repoUrl} variant="solid">
              View the code
            </PillLink>
            <PillLink href={pulse.demoUrl}>Full demo</PillLink>
          </div>
        </div>

        <div className="grid gap-20 md:gap-32">
          {pulse.moments.map((moment, index) => (
            <article
              key={moment.title}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div
                data-reveal
                className={`lg:col-span-4 ${index % 2 === 1 ? "lg:col-start-9 lg:row-start-1" : ""}`}
              >
                <h3 className="display-md">{moment.title}</h3>
                <p className="lede mt-5">{moment.body}</p>
              </div>
              <div
                data-reveal
                className={`frame lg:col-span-8 ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
              >
                <div className="frame-core">
                  <ClipVideo clip={moment.clip} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 md:mt-36">
          <h3 data-reveal className="display-md max-w-[18ch]">
            Decisions that hold it together.
          </h3>
          <div className="mt-12">
            <PointList points={pulse.decisions} />
          </div>
          <div data-reveal className="mt-10 border-t border-line pt-7">
            <TechLine tech={pulse.tech} />
          </div>
        </div>
      </div>
    </section>
  );
}
