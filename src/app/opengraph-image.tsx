import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0A0806",
          padding: "80px",
          fontFamily: "monospace",
          gap: "24px",
        }}
      >
        <div style={{ color: "#1D3FBF", fontSize: "13px", letterSpacing: "0.2em" }}>
          {"// MAXIMLABS · AI INFRASTRUCTURE"}
        </div>

        <div
          style={{
            fontSize: "88px",
            color: "#F5F0E8",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          BASEL ANAYA
        </div>

        <div style={{ fontSize: "22px", color: "#8B7D6B", maxWidth: "680px", lineHeight: 1.5 }}>
          Building infrastructure for the age of autonomous AI
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #2B5CFF 0%, #0091D5 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
