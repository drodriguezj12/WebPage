import { WordReveal } from "@/components/motion/WordReveal";
import { profile } from "@/data/profile";

export function Statement() {
  return (
    <section aria-labelledby="statement-label" className="px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 lg:grid-cols-[0.25fr_1fr]">
        <p id="statement-label" className="mono-label pt-3">
          How I work
        </p>
        <WordReveal
          text={profile.statement}
          className="max-w-[26ch] text-[clamp(1.75rem,4.4vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.035em] sm:max-w-[30ch]"
        />
      </div>
    </section>
  );
}
