import type { CSSProperties } from "react";
import type { Point } from "@/data/projects";

function order(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

/** Number, kind, name and tagline: the opening of every project section. */
export function ProjectIntro({
  index,
  kind,
  name,
  tagline,
  center = false,
}: {
  index: string;
  kind: string;
  name: string;
  tagline: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      <p className="eyebrow">
        <span className="eyebrow-dot" aria-hidden="true" />
        {index} · {kind}
      </p>
      <h2 className="display-lg mt-6">{name}</h2>
      <p className="display-md mt-3 text-muted">{tagline}</p>
    </div>
  );
}

/** Editorial list of points separated by hairlines. No cards. */
export function PointList({ points }: { points: readonly Point[] }) {
  return (
    <ol className="grid gap-x-12 md:grid-cols-3">
      {points.map((point, index) => (
        <li key={point.title} data-reveal style={order(index)} className="border-t border-line py-7">
          <span className="mono-label">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em]">{point.title}</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{point.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function TechLine({ tech }: { tech: readonly string[] }) {
  return (
    <p className="text-[0.9375rem] leading-relaxed text-muted">
      <span className="mono-label mr-4">Built with</span>
      {tech.join("  ·  ")}
    </p>
  );
}
