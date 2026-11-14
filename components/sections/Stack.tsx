import { stack } from "@/data/profile";

/**
 * The stack as type, not as badges or meters. A percentage next to a language
 * is a number nobody measured; a list grouped by what the tools are for is
 * simply true.
 */
export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="px-5 pb-28 md:px-10 md:pb-44">
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 id="stack-title" data-reveal className="display-lg">
          Stack
        </h2>

        <dl className="mt-14 md:mt-24">
          {stack.map((group) => (
            <div
              key={group.name}
              data-reveal
              className="grid gap-3 border-t border-line py-7 md:py-9 lg:grid-cols-12 lg:gap-10"
            >
              <dt className="mono-label lg:col-span-3 lg:pt-2.5">{group.name}</dt>
              <dd className="lg:col-span-9">
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[clamp(1.25rem,2.6vw,2.125rem)] font-semibold leading-snug tracking-[-0.03em]">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
