import { ImageResponse } from "next/og";
import { loadInter } from "@/lib/ogFont";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const inter = await loadInter(700);

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
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: "30px",
          letterSpacing: "-0.06em",
          color: "#f5f5f7",
        }}
      >
        DR
      </div>
    ),
    { ...size, fonts: [{ name: "Inter", data: inter, weight: 700, style: "normal" }] },
  );
}
