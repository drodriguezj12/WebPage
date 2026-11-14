import { ClipVideo } from "@/components/ClipVideo";
import type { Moment } from "@/data/projects";

/**
 * One moment of the product per row: what happens, and a clip of it happening.
 * Rows alternate sides on desktop and stack on a phone.
 */
export function ClipMoments({ moments }: { moments: readonly Moment[] }) {
  return (
    <div className="grid gap-20 md:gap-32">
      {moments.map((moment, index) => {
        const flipped = index % 2 === 1;
        return (
          <article key={moment.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div
              data-reveal
              className={`lg:col-span-4 ${flipped ? "lg:col-start-9 lg:row-start-1" : ""}`}
            >
              <h3 className="display-md">{moment.title}</h3>
              <p className="lede mt-5">{moment.body}</p>
            </div>
            <div
              data-reveal
              className={`frame lg:col-span-8 ${flipped ? "lg:col-start-1 lg:row-start-1" : ""}`}
            >
              <div className="frame-core">
                <ClipVideo clip={moment.clip} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
