type IconProps = { className?: string };

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...STROKE}>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...STROKE}>
      <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M4.5 2.8v10.4a.6.6 0 00.92.5l8.1-5.2a.6.6 0 000-1L5.42 2.3a.6.6 0 00-.92.5z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" />
    </svg>
  );
}
