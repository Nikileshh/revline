"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StadiumScene } from "@/components/home/stadium-scene";

const SEEN_KEY = "revline-intro-seen";
const IMPACT = 0.82; // seconds — the moment REV and LINE collide
const TOTAL_MS = 3100;

/** Deterministic dust burst (no randomness — SSR markup must match). */
const DUST = [
  { a: 355, d: 200, s: 22, t: 0.95 },
  { a: 20, d: 150, s: 14, t: 0.8 },
  { a: 45, d: 210, s: 26, t: 1.05 },
  { a: 80, d: 130, s: 12, t: 0.75 },
  { a: 120, d: 190, s: 20, t: 0.95 },
  { a: 150, d: 240, s: 28, t: 1.1 },
  { a: 175, d: 160, s: 16, t: 0.85 },
  { a: 200, d: 220, s: 24, t: 1.0 },
  { a: 230, d: 140, s: 12, t: 0.75 },
  { a: 260, d: 200, s: 18, t: 0.9 },
  { a: 290, d: 170, s: 14, t: 0.8 },
  { a: 320, d: 230, s: 24, t: 1.05 },
] as const;

const SPARKS = [
  { a: 10, d: 260 },
  { a: 70, d: 220 },
  { a: 140, d: 280 },
  { a: 190, d: 240 },
  { a: 250, d: 260 },
  { a: 310, d: 230 },
] as const;

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Cinematic opening: REV charges in from the left, LINE from the right;
 * they collide centre-screen with a flash, shockwave, camera shake and a
 * burst of dust — then the card lifts to reveal the page. Once per
 * session; click / Escape skips; reduced motion goes straight in.
 */
export function CinematicIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduce || sessionStorage.getItem(SEEN_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    const timer = setTimeout(() => setShow(false), TOTAL_MS);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
          onClick={() => setShow(false)}
          role="button"
          aria-label="Skip intro"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") setShow(false);
          }}
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden"
        >
          {/* Static scene under the intro — the hero runs the animated one */}
          <StadiumScene animated={false} />

          <motion.div
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            className="relative flex h-full flex-col items-center justify-center px-6"
          >
            {/* Camera shake + squash on impact */}
            <motion.div
              animate={{
                x: [0, 0, -8, 7, -4, 2, 0],
                y: [0, 0, 5, -5, 3, -1, 0],
                scaleX: [1, 1, 0.965, 1.02, 0.995, 1, 1],
              }}
              transition={{
                duration: 0.55,
                delay: IMPACT - 0.03,
                times: [0, 0.05, 0.2, 0.42, 0.62, 0.82, 1],
                ease: "easeOut",
              }}
              className="relative"
            >
              <h1 className="flex font-display text-[17vw] font-bold uppercase italic leading-[1.05] tracking-tight sm:text-9xl">
                <motion.span
                  initial={{ x: "-64vw" }}
                  animate={{ x: 0 }}
                  transition={{ duration: IMPACT, ease: [0.55, 0, 0.85, 0.4] }}
                  className="text-[#fdf4df] [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]"
                >
                  REV
                </motion.span>
                <motion.span
                  initial={{ x: "64vw" }}
                  animate={{ x: 0 }}
                  transition={{ duration: IMPACT, ease: [0.55, 0, 0.85, 0.4] }}
                  className="text-[#ffa03c] [text-shadow:0_3px_10px_rgba(10,4,12,0.9),0_0_50px_rgba(255,150,40,0.5)]"
                >
                  LINE
                </motion.span>
              </h1>
            </motion.div>

            {/* Impact flash */}
            <motion.div
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{ opacity: [0, 1, 0], scale: [0.35, 1.4, 2.1] }}
              transition={{ delay: IMPACT, duration: 0.5, times: [0, 0.22, 1], ease: "easeOut" }}
              className="pointer-events-none absolute size-[72vmin] rounded-full bg-[radial-gradient(circle,rgba(255,242,214,0.95)_0%,rgba(255,150,40,0.5)_38%,transparent_68%)]"
            />
            {/* Shockwave ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 0.85, 0], scale: [0.2, 2.7] }}
              transition={{ delay: IMPACT + 0.02, duration: 0.75, times: [0, 0.18, 1], ease: "easeOut" }}
              className="pointer-events-none absolute size-[44vmin] rounded-full border-2 border-[#ffd9a3]/80"
            />

            {/* Dust flying out of the collision */}
            {DUST.map((p, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                animate={{
                  x: Math.cos(rad(p.a)) * p.d,
                  y: Math.sin(rad(p.a)) * p.d * 0.7 - 30,
                  opacity: [0, 0.75, 0],
                  scale: [0.3, 1.25],
                }}
                transition={{ delay: IMPACT + 0.02, duration: p.t, ease: [0.2, 0.7, 0.4, 1] }}
                className="pointer-events-none absolute rounded-full bg-[#e8cfa8] blur-[3px]"
                style={{ width: p.s, height: p.s }}
              />
            ))}
            {/* Hot sparks */}
            {SPARKS.map((p, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(rad(p.a)) * p.d,
                  y: Math.sin(rad(p.a)) * p.d * 0.6 - 20,
                  opacity: [0, 1, 0],
                }}
                transition={{ delay: IMPACT, duration: 0.6, ease: "easeOut" }}
                className="pointer-events-none absolute size-1.5 rounded-full bg-[#ffcf7a] shadow-[0_0_10px_rgba(255,180,80,0.9)]"
              />
            ))}

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: IMPACT + 0.55, duration: 0.55 }}
              className="mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-[#f3e6cc]/85 sm:text-sm"
            >
              A Hybrid Training Club
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.7 }}
              className="absolute bottom-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#f3e6cc]/50"
            >
              Click to enter
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
