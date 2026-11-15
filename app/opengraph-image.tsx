import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { loadInter } from "@/lib/ogFont";

export const alt = "Daniel Rodriguez | Backend / Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENTS = ["#f0429f", "#c99a1c", "#3ecf8e"];

export default async function OpenGraphImage() {
  const [medium, semibold] = await Promise.all([loadInter(500), loadInter(600)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f7",
          padding: "72px 80px",
          fontFamily: "Inter",
          color: "#1d1d1f",
        }}
      >
        <div style={{ display: "flex", fontSize: "26px", fontWeight: 500, color: "#5e5e63" }}>
          {profile.name} · {profile.role}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "104px",
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
          }}
        >
          <span>{profile.headline[0]}</span>
          <span>{profile.headline[1]}</span>
          <span style={{ color: "#86868b" }}>{profile.headline[2]}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {ACCENTS.map((color) => (
              <div
                key={color}
                style={{ width: "44px", height: "6px", borderRadius: "3px", backgroundColor: color }}
              />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: "24px", fontWeight: 500, color: "#5e5e63" }}>
            Java · Spring Boot · Angular · PostgreSQL
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: medium, weight: 500, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
