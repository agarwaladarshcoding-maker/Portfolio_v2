// Generated share card. Next.js picks this file up by convention and emits both
// og:image and twitter:image, so there is no static asset to keep in sync with
// lib/data.ts. Uses only system-safe layout — no remote fonts, no network.
import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

export const alt = `${site.name} — ${site.role}`;
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
          justifyContent: "space-between",
          background: "#0e0f14",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#7c7a74",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#ff5d3b" }} />
          {site.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ece7dd", fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ color: "#ff5d3b", fontSize: 46, fontWeight: 600, marginTop: 12 }}>
            {site.role}
          </div>
          <div
            style={{
              color: "#b6b2a9",
              fontSize: 28,
              lineHeight: 1.45,
              marginTop: 28,
              maxWidth: 900,
            }}
          >
            {site.summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#7c7a74",
            fontSize: 24,
            borderTop: "1px solid #262833",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>know-about-adarsh.vercel.app</div>
          <div style={{ display: "flex" }}>{site.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
