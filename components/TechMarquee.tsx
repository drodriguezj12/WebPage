const MARQUEE_ITEMS = [
  "Java",
  "Spring Boot",
  "Angular",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Oracle",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "Kafka",
  "Quarkus",
  "AWS",
  "Git",
];

export function TechMarquee() {
  return (
    <div
      className="border-y border-border bg-surface/40 py-5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee gap-4">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex shrink-0 items-center gap-3 text-lg font-semibold text-muted"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
