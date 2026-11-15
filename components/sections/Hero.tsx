import type { CSSProperties } from "react";
import { PillLink } from "@/components/PillLink";
import { Odometer } from "@/components/motion/Odometer";
import { SignalField } from "@/components/motion/SignalField";
import { profile } from "@/data/profile";
import { pulse, secop, smartpark } from "@/data/projects";

const INDEX = [
  { project: pulse, accent: "pulse" },
  { project: secop, accent: "secop" },
  { project: smartpark, accent: "park" },
] as const;

function order(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

/**
 * The headline arrives letter by letter. Each letter is its own inline block so
 * it can move; letters are grouped into words so a line can only break between
 * words. The heading's accessible name is the plain sentence.
 */
function Headline({ lines }: { lines: readonly string[] }) {
  let position = 0;

  return (
    <h1 className="display-xl mt-7 md:mt-[4vh]" aria-label={lines.join(" ")}>
      {lines.map((line, lineIndex) => (
        <span
          key={line}
          aria-hidden="true"
          className={`block ${lineIndex === lines.length - 1 ? "text-faint" : ""}`}
        >
          {line.split(" ").map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`}>
              {wordIndex > 0 ? " " : null}
              <span className="hero-word">
                {[...word].map((char) => (
                  <span
                    key={position}
                    className="hero-char"
                    style={{ "--c": position++ } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/**
 * The first screen is visible from first paint: its entrance is plain CSS
 * (`.hero-char` / `.hero-item`), so nothing waits on JavaScript. The network
 * behind it is the only scripted part, and the page reads the same without it.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 pb-4 pt-28 md:px-10 md:pt-[12.5vh]"
    >
      <SignalField className="hero-field pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col">
        <p className="eyebrow hero-item self-start" style={order(0)}>
          <span className="eyebrow-dot" aria-hidden="true" />
          {profile.role} · {profile.location}
        </p>

        <Headline lines={profile.headline} />

        <div className="mt-10 grid gap-10 md:mt-[4vh] lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div className="hero-item" style={order(3)}>
            <p className="lede max-w-[46ch]">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillLink href="#work" variant="solid" icon="down">
                See the work
              </PillLink>
              <PillLink href="/cv.pdf" icon="down" download>
                Download CV
              </PillLink>
            </div>
          </div>

          <dl className="hero-item grid grid-cols-3 gap-6" style={order(4)}>
            {profile.figures.map((item) => (
              <div key={item.label} className="border-t border-line pt-4">
                <dd className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold tracking-[-0.04em]">
                  <Odometer figure={item.figure} />
                </dd>
                <dt className="mt-1.5 text-[0.8125rem] leading-snug text-muted">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/*
          The project index: a hairline with three packets travelling along it,
          one in each project's colour.
        */}
        <nav
          aria-label="Projects"
          className="hero-item relative mt-auto pt-12 md:pt-[4vh]"
          style={order(5)}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-12 h-[3px] w-full -translate-y-px md:top-[4vh]"
            viewBox="0 0 1000 3"
            preserveAspectRatio="none"
          >
            <rect width="1000" height="1" y="1" fill="var(--line)" />
            {["#f0429f", "#c99a1c", "#3ecf8e"].map((color, index) => (
              <rect key={color} className="packet" width="42" height="3" rx="1.5" fill={color}>
                <animate
                  attributeName="x"
                  from="-42"
                  to="1000"
                  dur="7s"
                  begin={`${index * 2.3}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}
          </svg>

          <ul className="grid sm:grid-cols-3">
            {INDEX.map(({ project, accent }) => (
              <li key={project.id} data-accent={accent}>
                <a
                  href={`#${project.id}`}
                  className="focus-ring group flex items-baseline gap-4 py-4 pr-6 sm:block sm:py-5"
                >
                  <span className="mono-label">{project.index}</span>
                  <span className="block text-xl font-semibold tracking-[-0.03em] transition-colors duration-500 ease-fluid group-hover:text-accent sm:mt-3 sm:text-2xl">
                    {project.name}
                  </span>
                  <span className="ml-auto text-[0.8125rem] text-muted sm:ml-0 sm:mt-1 sm:block">
                    {project.kind}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
