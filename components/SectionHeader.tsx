import type { ReactNode } from "react";
import { ScrambleText } from "./motion/ScrambleText";
import { SplitText } from "./motion/SplitText";

/**
 * Every section opens the same way: a number, a label, a rule, a headline.
 * Repeating the shape is what makes the page read as one document rather than
 * six pages stacked.
 */
export function SectionHeader({
  index,
  label,
  lines,
}: {
  index: string;
  label: string;
  lines: ReactNode[];
}) {
  return (
    <header className="mb-16">
      <p className="label mb-6 flex items-center gap-4">
        <span className="text-dim">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <ScrambleText text={label} />
      </p>
      <SplitText
        as="h2"
        lines={lines}
        className="display text-[44px] md:text-[68px] lg:text-[96px]"
      />
    </header>
  );
}
