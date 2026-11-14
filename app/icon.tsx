import { ImageResponse } from "next/og";
import { loadGeist } from "@/lib/ogFont";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const geist = await loadGeist(700);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1d1d1f",
          borderRadius: "16px",
          fontFamily: "Geist",
          fontWeight: 700,
          fontSize: "30px",
          letterSpacing: "-0.06em",
          color: "#f5f5f7",
        }}
      >
        DR
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, weight: 700, style: "normal" }] },
  );
}
