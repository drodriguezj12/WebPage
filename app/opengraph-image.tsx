import { ImageResponse } from "next/og";

export const alt = "Daniel Rodriguez | Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0c",
          padding: "80px",
          fontFamily: "sans-serif",
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
              backgroundColor: "#f4f4f5",
              color: "#0a0a0c",
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
              color: "#ff6a3d",
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
              flexWrap: "wrap",
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            <span style={{ color: "#f4f4f5", marginRight: "20px" }}>Building</span>
            <span style={{ color: "#ff6a3d", marginRight: "20px" }}>production-ready</span>
            <span style={{ color: "#f4f4f5", marginRight: "20px" }}>web</span>
            <span style={{ color: "#f4f4f5" }}>platforms.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", color: "#a1a1aa", fontSize: "24px" }}>
          Java · Spring Boot · Angular · AWS · Kubernetes
        </div>
      </div>
    ),
    { ...size }
  );
}
