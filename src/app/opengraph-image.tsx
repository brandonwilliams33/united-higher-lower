import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "United Higher / Lower — a game for the United faithful";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#911d2b",
        color: "#f5f3ec",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "70px",
      }}
    >
      <div style={{ fontSize: 140, fontWeight: 900, letterSpacing: -8 }}>
        UNITED
      </div>
      <div style={{ fontSize: 56 }}>HIGHER / LOWER</div>
      <div
        style={{
          display: "flex",
          marginTop: 45,
          paddingTop: 25,
          borderTop: "2px solid #d9b68b",
          fontSize: 28,
        }}
      >
        Two players. One stat. Your call.
      </div>
      <div style={{ fontSize: 20, marginTop: 35 }}>Unofficial fan project.</div>
    </div>,
    size,
  );
}
