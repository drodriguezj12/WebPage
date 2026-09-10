export type ParsedFigure = {
  value: number;
  prefix: string;
  suffix: string;
};

/**
 * Figures on the site are written the way they should read — "3+", "30%",
 * "95" — not as numbers with formatting options. This splits one into the part
 * that animates and the parts that stay put.
 */
export function parseFigure(raw: string): ParsedFigure {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { value: 0, prefix: raw, suffix: "" };
  const [, prefix, digits, suffix] = match;
  return { value: Number(digits), prefix, suffix };
}

export function formatFigure(current: number, parsed: ParsedFigure): string {
  const safe = Math.max(0, Math.round(current));
  return `${parsed.prefix}${safe}${parsed.suffix}`;
}
