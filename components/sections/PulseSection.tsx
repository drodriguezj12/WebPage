import { ClipVideo } from "@/components/ClipVideo";
import { PillLink } from "@/components/PillLink";
import { ScaleStage } from "@/components/motion/ScaleStage";
import { ClipMoments } from "@/components/project/ClipMoments";
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

        <ClipMoments moments={pulse.moments} />

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
