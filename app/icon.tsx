import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// SVG favicons cannot load a web font, so the `DR` monogram from the old
// icon.svg (a system-font text node) could not carry the new display type.
// ImageResponse can: it loads the same Big Shoulders file opengraph-image.tsx
// does and renders the mark exactly as before otherwise -- dark background,
// hairline border, steel monogram.
export default async function Icon() {
  const bigShouldersBold = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/big-shoulders/files/big-shoulders-latin-800-normal.woff",
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08080a",
          border: "1px solid #1b1b20",
          borderRadius: "14px",
          fontFamily: "Big Shoulders",
          fontWeight: 800,
          fontSize: "32px",
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "#cbd5e1",
        }}
      >
        DR
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Big Shoulders",
          data: bigShouldersBold,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
