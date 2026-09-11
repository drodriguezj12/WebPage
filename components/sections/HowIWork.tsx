import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

/**
 * Claims with evidence attached. An adjective ("passionate", "detail-oriented")
 * is worth nothing to a reader who has seen a hundred portfolios; a number is.
 */
const CLAIMS = [
  {
    title: "I optimise what I can measure",
    body: "Contract search at Proyectos y Servicios RACO returned roughly 30% faster after reworking the queries behind it.",
  },
  {
    title: "I test against the real thing",
    body: "Pulse runs 95 tests, and its integration tests run against a real PostgreSQL through Testcontainers. H2 cannot execute PL/pgSQL, so a suite built on it would skip the part that matters.",
  },
  {
    title: "I ship whole systems",
    body: "Pulse's database, services and frontend come up with one Docker Compose command, migrations included, and every push is built and tested by CI.",
  },
];

export function HowIWork() {
  return (
    <section id="approach" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="03" label="Approach" lines={["How I", "work"]} />
        <Stagger className="grid gap-12 md:grid-cols-3" total={0.45}>
          {CLAIMS.map((claim, index) => (
            <div key={claim.title}>
              <span className="label block">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-[26px] text-steel">{claim.title}</h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted">
                {claim.body}
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
