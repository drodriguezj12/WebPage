import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpRightIcon } from "@/components/icons";

type Props = {
  href: string;
  children: ReactNode;
  /** `solid` is the one primary action in a group; `ghost` is everything else. */
  variant?: "solid" | "ghost";
  /** Arrow direction: `out` for links that leave, `down` for in-page and downloads. */
  icon?: "out" | "down";
  download?: boolean;
};

/**
 * Pill with its arrow seated in its own circle. On hover the circle moves, not
 * the whole button, so the response reads as something inside it shifting.
 */
export function PillLink({ href, children, variant = "ghost", icon = "out", download }: Props) {
  const external = href.startsWith("http");
  const Icon = icon === "out" ? ArrowUpRightIcon : ArrowDownIcon;
  const surface =
    variant === "solid"
      ? "bg-fg text-bg"
      : "text-fg shadow-[inset_0_0_0_1px_var(--line)] hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)]";
  const seat =
    variant === "solid"
      ? "bg-[color-mix(in_srgb,var(--bg)_16%,transparent)]"
      : "bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]";
  const nudge =
    icon === "out"
      ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      : "group-hover:translate-y-0.5";

  return (
    <a
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`focus-ring group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,transform] duration-500 ease-fluid active:scale-[0.97] ${surface}`}
    >
      {children}
      <span
        className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-fluid ${seat} ${nudge}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
