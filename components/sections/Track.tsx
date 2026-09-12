import { educationItems } from "@/data/education";
import { skillCategories } from "@/data/skills";
import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

export function Track() {
  return (
    <section id="track" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="04" label="Track" lines={["Where", "it comes from"]} />

        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Stagger className="grid gap-8">
            {educationItems.map((item) => (
              <div key={item.institution} className="border-t border-border pt-5">
                <h3 className="display text-[24px]">{item.institution}</h3>
                <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>

          <Stagger className="grid gap-8 sm:grid-cols-2" total={0.5}>
            {skillCategories.map((category) => (
              <div key={category.name} className="border-t border-border pt-5">
                <h3 className="label mb-4">{category.name}</h3>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item} className="border border-border px-2.5 py-1.5 text-xs text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
