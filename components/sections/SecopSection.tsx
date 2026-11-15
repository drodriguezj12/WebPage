import type { CSSProperties } from "react";
import { Odometer } from "@/components/motion/Odometer";
import { ClipMoments } from "@/components/project/ClipMoments";
import { PointList, ProjectIntro, TechLine } from "@/components/project/parts";
import { secop } from "@/data/projects";

/**
 * Text that types itself once its figure is on screen. Every character is in
 * the markup from the start, so nothing shifts as it appears; globals.css only
 * staggers their opacity. Assistive technology reads the sentence once.
 */
function Typed({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((char, index) => (
          <span key={index} className="type-char" style={{ "--c": index } as CSSProperties}>
            {char}
          </span>
        ))}
      </span>
    </>
  );
}

/** When a stage of the flow starts, in milliseconds after it is revealed. */
function at(ms: number): CSSProperties {
  return { "--at": `${ms}ms` } as CSSProperties;
}

/**
 * What happens behind the assistant, played out once: the question types
 * itself, the query is written line by line, and the answer arrives. The clips
 * below show the product; this shows the part of it that never appears on
 * screen.
 */
function AssistantFlow() {
  const { flow } = secop;
  const question = `\u201c${flow.question}\u201d`;
  // The question takes about this long to type (24 ms a character).
  const asked = question.length * 24 + 500;
  const written = asked + flow.query.length * 240 + 400;

  return (
    <figure data-theme="dark" data-accent="secop" className="frame bg-transparent">
      <div data-flow data-reveal className="frame-core grid gap-px bg-white/10 text-fg">
        <div className="bg-night p-6 md:p-9">
          <p className="mono-label">You ask</p>
          <p className="mt-4 text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold leading-tight tracking-[-0.03em]">
            <Typed text={question} />
            <span aria-hidden="true" className="type-caret" />
          </p>
        </div>

        <div className="bg-night p-6 md:p-9">
          <p className="mono-label flow-stage" style={at(asked)}>
            <span className="text-accent">{flow.model}</span> writes the query
          </p>
          <pre className="mt-4 overflow-x-auto font-mono text-[0.8125rem] leading-relaxed text-muted md:text-[0.9375rem]">
            <code>
              {flow.query.map((line, index) => (
                <span key={line} className="flow-stage block" style={at(asked + 200 + index * 240)}>
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </div>

        <div className="bg-night p-6 md:p-9">
          <p className="mono-label flow-stage" style={at(written)}>
            <span className="text-accent">{flow.source}</span> answers
          </p>
          <p
            className="flow-stage mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted md:text-base"
            style={at(written + 300)}
          >
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
                  <Odometer figure={item.figure} />
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
