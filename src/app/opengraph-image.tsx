import { ImageResponse } from "next/og";
import { DOMAINS, TOOLS } from "@/lib/registry";

export const alt = "Utility Toolz: professional tools, organized by domain";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "#1f4a3f",
          color: "#fef5de",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 600 }}>Utility Toolz</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, lineHeight: 1.1 }}>
            Professional tools, organized by domain
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, opacity: 0.85 }}>
            {`${TOOLS.length} free tools across ${DOMAINS.length} domains`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
