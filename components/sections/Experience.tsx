import { education, experience } from "@/data/profile";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="px-5 py-28 md:px-10 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 id="experience-title" data-reveal className="display-lg">
          Experience
        </h2>

        <ol className="mt-14 md:mt-24">
          {experience.map((item) => (
            <li
              key={item.company}
              data-reveal
              className="grid gap-6 border-t border-line py-10 md:py-14 lg:grid-cols-12 lg:gap-10"
            >
              <p className="mono-label lg:col-span-3 lg:pt-3">{item.period}</p>
              <div className="lg:col-span-4">
                <h3 className="display-md">{item.company}</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">
                  {item.role}
                  <br />
                  {item.place}
                </p>
              </div>
              <ul className="grid gap-4 lg:col-span-5 lg:pt-2">
                {item.points.map((point) => (
                  <li key={point} className="text-[0.9375rem] leading-relaxed text-muted md:text-base">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <dl className="grid border-t border-line sm:grid-cols-2">
          {education.map((item) => (
            <div key={item.institution} data-reveal className="py-8 sm:pr-10">
              <dt className="text-xl font-semibold tracking-[-0.025em]">{item.institution}</dt>
              <dd className="mt-2 text-[0.9375rem] text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
