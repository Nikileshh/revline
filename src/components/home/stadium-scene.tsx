"use client";

import { motion, useReducedMotion } from "motion/react";

/** Rim height of the stadium bowl at horizontal position t (0..1). */
function rimY(t: number): number {
  return (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 330 + t * t * 30;
}

const LIGHTS = Array.from({ length: 26 }, (_, i) => {
  const t = (30 + i * (1540 / 25)) / 1600;
  return { x: t * 1600, y: rimY(t) - 10 };
});

const CLOUDS = [
  { left: "4%", top: "4%", w: "38%", h: 90, color: "rgba(74,16,48,0.75)", drift: 46, dur: 46 },
  { left: "48%", top: "2%", w: "42%", h: 110, color: "rgba(138,31,43,0.6)", drift: -38, dur: 54 },
  { left: "18%", top: "16%", w: "34%", h: 70, color: "rgba(199,58,46,0.4)", drift: 32, dur: 40 },
  { left: "60%", top: "20%", w: "30%", h: 64, color: "rgba(58,15,46,0.7)", drift: -28, dur: 50 },
  { left: "-6%", top: "24%", w: "30%", h: 56, color: "rgba(122,22,38,0.5)", drift: 40, dur: 58 },
] as const;

/**
 * Cinematic stadium at sunset, drawn in code: crimson-purple sky, blazing
 * horizon sun, silhouetted bowl with two tiers of floodlights, warm-lit
 * grass. Stands in for the reference photo and costs no bytes to load.
 */
export function StadiumScene() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#150a26]">
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: [1, 1.035, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Sky */}
        <div className="absolute inset-x-0 top-0 h-[70%] bg-[linear-gradient(180deg,#150a26_0%,#39102e_24%,#6d1527_42%,#b23320_58%,#e86a15_72%,#ffb141_86%,#ffd76e_100%)]" />

        {/* Sun */}
        <motion.div
          className="absolute left-1/2 top-[56%] size-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff8d9_0%,#ffd75a_16%,rgba(255,150,40,0.6)_42%,transparent_70%)]"
          animate={reduce ? undefined : { opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Clouds */}
        {CLOUDS.map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{ left: c.left, top: c.top, width: c.w, height: c.h, backgroundColor: c.color }}
            animate={reduce ? undefined : { x: [0, c.drift, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Stadium bowl silhouette with floodlights */}
        <svg
          viewBox="0 0 1600 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[34%] h-[34%] w-full"
        >
          {/* Far stand behind the sun */}
          <path d="M0,30 Q800,330 1600,30 L1600,420 L0,420 Z" fill="#1a0b12" opacity="0.94" />
          <path d="M0,30 Q800,330 1600,30" fill="none" stroke="#31141c" strokeWidth="10" />
          {/* Inner tier line */}
          <path d="M0,90 Q800,368 1600,90" fill="none" stroke="#241016" strokeWidth="26" opacity="0.9" />
          {/* Floodlights, upper rim */}
          {LIGHTS.map((l, i) => (
            <g key={i}>
              <circle cx={l.x} cy={l.y} r="8" fill="#ffdf8e" opacity="0.3" />
              <circle cx={l.x} cy={l.y} r="2.8" fill="#fff3c9" opacity="0.95" />
            </g>
          ))}
          {/* Dimmer second row */}
          {LIGHTS.filter((_, i) => i % 2 === 0).map((l, i) => (
            <circle key={i} cx={l.x + 30} cy={l.y + 42} r="2" fill="#ffd98e" opacity="0.5" />
          ))}
        </svg>

        {/* Grass */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(180deg,#7a5210_0%,#3c3a0e_16%,#1d2609_42%,#0b1205_75%,#050803_100%)]" />
        {/* Warm sheen thrown by the sun onto the pitch */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[radial-gradient(ellipse_55%_65%_at_50%_0%,rgba(255,160,45,0.4),transparent_65%)]" />
        {/* Mowing stripes */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] opacity-40 [background-image:repeating-linear-gradient(180deg,rgba(255,190,80,0.05)_0px,rgba(255,190,80,0.05)_10px,transparent_10px,transparent_22px)]" />
      </motion.div>

      {/* Film layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(8,3,10,0.55))]" />
      <div className="film-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
