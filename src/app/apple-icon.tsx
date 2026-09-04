import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — dark tile, mono B, the cobalt signal dot. Matches icon.svg.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#12110D",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: 28,
            border: "4px solid rgba(43, 92, 255, 0.55)",
          }}
        />
        <div
          style={{
            fontSize: 92,
            color: "#F5F0E8",
            fontWeight: 700,
            fontFamily: "monospace",
            transform: "translateX(-8px)",
          }}
        >
          B
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            bottom: 52,
            width: 13,
            height: 13,
            borderRadius: 999,
            background: "#2B5CFF",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
