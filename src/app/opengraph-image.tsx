import { ImageResponse } from "next/og";

export const alt = "RevLine — A Hybrid Training Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#ff8c1f";
const SPORTS = "RUNNING · FOOTBALL · TURF · TREKKING · SWIMMING · WORKOUTS";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1d1026",
          backgroundImage:
            "radial-gradient(ellipse 65% 60% at 50% -12%, rgba(255,140,31,0.4), rgba(29,16,38,0))",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "10px 28px",
            borderRadius: 999,
            border: `2px solid ${ORANGE}`,
            color: "#ffd9a3",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 8,
          }}
        >
          A HYBRID TRAINING CLUB
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 168,
            fontWeight: 800,
            fontStyle: "italic",
            letterSpacing: -6,
            color: "#fdf2dd",
            lineHeight: 1,
          }}
        >
          REV
          <span style={{ color: ORANGE }}>LINE</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 36,
            color: "rgba(253,242,221,0.85)",
            textAlign: "center",
          }}
        >
          Consistency builds power. Community builds purpose.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(253,242,221,0.5)",
          }}
        >
          {SPORTS}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 16,
            display: "flex",
            backgroundImage: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
