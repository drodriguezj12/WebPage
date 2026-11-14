import type { CSSProperties } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { ClipMoments } from "@/components/project/ClipMoments";
import { PointList, ProjectIntro, TechLine } from "@/components/project/parts";
import { secop } from "@/data/projects";

function step(n: number): CSSProperties {
  return { "--step": n } as CSSProperties;
}

/**
 * What happens behind the assistant, from a sentence to a result, lit one step
 * at a time. The clips below show the product; this shows the part of it that
 * never appears on screen.
 */
function AssistantFlow() {
  const { flow } = secop;

  return (
    <figure data-theme="dark" data-accent="secop" className="frame bg-transparent">
      <div data-flow data-reveal className="frame-core grid gap-px bg-white/10 text-fg">
        <div data-step style={step(0)} className="bg-night p-6 md:p-9">
          <p className="mono-label">You ask</p>
          <p className="mt-4 text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold leading-tight tracking-[-0.03em]">
            “{flow.question}”
          </p>
        </div>

        <div data-step style={step(1)} className="bg-night p-6 md:p-9">
          <p className="mono-label">
            <span className="text-accent">{flow.model}</span> writes the query
          </p>
          <pre className="mt-4 overflow-x-auto font-mono text-[0.8125rem] leading-relaxed text-muted md:text-[0.9375rem]">
            <code>
              {flow.query.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </div>

        <div data-step style={step(2)} className="bg-night p-6 md:p-9">
          <p className="mono-label">
            <span className="text-accent">{flow.source}</span> answers
          </p>
          <p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted md:text-base">
            {flow.result}
          </p>
        </div>
      </div>
      <figcaption className="px-4 pb-2 pt-4 text-[0.8125rem] text-faint">
        What happens behind the answer. The query is representative, not a transcript.
      </figcaption>
    </figure>
  );
}

export function SecopSection() {
  return (
    <section
      id="secop"
      data-accent="secop"
      aria-labelledby="secop-title"
      className="px-5 py-28 md:px-10 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div data-reveal id="secop-title">
          <ProjectIntro
            index={secop.index}
            kind={secop.kind}
            name={secop.name}
            tagline={secop.tagline}
          />
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <p data-reveal className="lede lg:col-span-5 lg:pt-4">
            {secop.summary}
          </p>
          <div className="lg:col-span-7">
            <AssistantFlow />
          </div>
        </div>

        <div className="mt-24 md:mt-36">
          <ClipMoments moments={secop.moments} />
        </div>

        <div className="mt-24 md:mt-36">
          <h3 data-reveal className="display-md max-w-[20ch]">
            Measured with the people who use it.
          </h3>
          <dl className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {secop.figures.map((item, index) => (
              <div
                key={item.label}
                data-reveal
                style={{ "--i": index } as CSSProperties}
                className="border-t border-line py-7"
              >
                <dd className="text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-none tracking-[-0.05em] text-accent">
                  <CountUp figure={item.figure} />
                </dd>
                <dt className="mt-4 max-w-[26ch] text-[0.9375rem] leading-snug text-muted">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
          <p data-reveal className="mt-2 max-w-[70ch] text-[0.8125rem] leading-relaxed text-faint">
            {secop.footnote}
          </p>
        </div>

        <div className="mt-20 md:mt-28">
          <PointList points={secop.points} />
          <div data-reveal className="mt-10 border-t border-line pt-7">
            <TechLine tech={secop.tech} />
          </div>
        </div>
      </div>
    </section>
  );
}
