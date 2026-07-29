// Generated share card. Next.js picks this file up by convention and emits both
// og:image and twitter:image, so there is no static asset to keep in sync with
// lib/data.ts. Uses only system-safe layout — no remote fonts, no network.
import { ImageResponse } from "next/og";
import { site, thesis } from "@/lib/data";

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
          background: "#EDEFF2",
          padding: "68px 76px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#8B95A0",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#1A2FD6" }} />
          {site.role} · {site.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Three lines, matching the hero. Satori needs every multi-child
              node to declare display, so each line is its own flex row. */}
          {thesis.headline.map((line, i) => (
            <div
              key={line}
              style={{
                display: "flex",
                color: "#0A1017",
                fontSize: 96,
                fontWeight: 500,
                lineHeight: 1.02,
                letterSpacing: -2,
              }}
            >
              {i === thesis.headline.length - 1 ? (
                <>
                  <span>{line.replace(/\.$/, "")}</span>
                  <span style={{ color: "#1A2FD6" }}>.</span>
                </>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              color: "#4E5A66",
              fontSize: 26,
              lineHeight: 1.45,
              marginTop: 28,
              maxWidth: 880,
              fontFamily: "sans-serif",
            }}
          >
            {site.summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8B95A0",
            fontSize: 22,
            borderTop: "1px solid #D3D9DF",
            paddingTop: 24,
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", color: "#0A1017" }}>{site.name}</div>
          <div style={{ display: "flex" }}>know-about-adarsh.vercel.app</div>
        </div>
      </div>
    ),
    size,
  );
}
