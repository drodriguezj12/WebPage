import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Satori (behind ImageResponse) has no system fonts and cannot read woff2, so
 * the generated icon and Open Graph image load Geist from disk as woff.
 * process.cwd() is the project root at build time.
 */
export function loadGeist(weight: 500 | 600 | 700): Promise<Buffer> {
  return readFile(
    join(
      process.cwd(),
      `node_modules/@fontsource/geist-sans/files/geist-sans-latin-${weight}-normal.woff`,
    ),
  );
}
