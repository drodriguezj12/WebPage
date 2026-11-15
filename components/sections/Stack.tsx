import { Marquee } from "@/components/motion/Marquee";
import { stack } from "@/data/profile";

/**
 * The stack as type, not as badges or meters. A percentage next to a language
 * is a number nobody measured; a list grouped by what the tools are for is
 * simply true. Each group drifts sideways, alternating direction, and picks up
 * speed from the scroll.
 */
export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="pb-28 md:pb-44">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <h2 id="stack-title" data-reveal className="display-lg">
          Stack
        </h2>
      </div>

      <dl className="mt-14 md:mt-24">
        {stack.map((group, index) => (
          <div key={group.name} data-reveal className="border-t border-line py-6 md:py-8">
            <dt className="mono-label mx-auto w-full max-w-[1280px] px-5 md:px-10">
              {group.name}
            </dt>
            <dd className="mt-3 text-[clamp(1.5rem,3.6vw,3rem)] font-semibold leading-tight tracking-[-0.035em]">
              <Marquee items={group.items} reverse={index % 2 === 1} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
