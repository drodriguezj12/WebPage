import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Daniel Rodriguez | Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Load the font from disk; process.cwd() resolves to the project root at build time.
  const bigShouldersBold = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/big-shoulders/files/big-shoulders-latin-800-normal.woff"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08080a",
          padding: "80px",
          // Satori has no system fonts: with a single registered font it renders
          // every text node in it. Declaring it here says what actually renders.
          fontFamily: "Big Shoulders",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              backgroundColor: "#cbd5e1",
              color: "#08080a",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            DR
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "26px", fontWeight: 600 }}>
            Daniel Rodriguez
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              color: "#cbd5e1",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Full-Stack Developer
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Big Shoulders",
              fontWeight: 800,
              fontSize: "76px",
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              color: "#cbd5e1",
              maxWidth: "1000px",
            }}
          >
            <span>Systems that hold up</span>
            <span>in production.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", color: "#86868f", fontSize: "24px" }}>
          Java · Spring Boot · Angular · AWS · Kubernetes
        </div>
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
    }
  );
}
