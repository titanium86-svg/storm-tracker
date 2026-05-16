import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Storm Tracker";
  const sub = searchParams.get("sub") ?? "Tropical Cyclone Research";
  const cat = searchParams.get("cat") ?? "";

  const catColors: Record<string, string> = {
    "1": "#3b82f6", "2": "#10b981", "3": "#eab308",
    "4": "#f97316", "5": "#ef4444",
  };
  const accent = catColors[cat] ?? "#c2410c";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: "#08090c",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* accent bar */}
        <div style={{ width: 64, height: 4, background: accent, marginBottom: 32, borderRadius: 2 }} />
        {cat && (
          <div style={{
            color: accent, fontSize: 18, fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16,
          }}>
            {cat === "TD" ? "Tropical Depression" : cat === "TS" ? "Tropical Storm" : `Category ${cat}`}
          </div>
        )}
        <div style={{ color: "#f5efe1", fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ color: "#9ca3af", fontSize: 28, marginBottom: 48 }}>{sub}</div>
        <div style={{ color: "#6b7280", fontSize: 20, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          storm-tracker-one.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
