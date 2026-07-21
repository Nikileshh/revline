"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StadiumScene } from "@/components/home/stadium-scene";

const LETTERS = ["R", "E", "V", "L", "I", "N", "E"] as const;
const SEEN_KEY = "revline-intro-seen";
const DURATION_MS = 3600;

/**
 * Full-screen cinematic title card shown once per visit before the landing
 * page: the rev line draws across the stadium, REVLINE rises out of it,
 * the tagline settles, then the whole card lifts to reveal the site.
 * Click anywhere to skip; respects reduced motion; replays next session.
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
    const timer = setTimeout(() => setShow(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.045 }}
          transition={{ duration: 1.15, ease: [0.83, 0, 0.17, 1] }}
          onClick={() => setShow(false)}
          role="button"
          aria-label="Skip intro"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") setShow(false);
          }}
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden"
        >
          <StadiumScene />

          <motion.div
            exit={{ y: -36, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
            className="relative flex h-full flex-col items-center justify-center px-6"
          >
            {/* The rev line draws across first */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-[3px] w-[min(78vw,620px)] origin-left rounded-full bg-gradient-to-r from-transparent via-[#ffb141] to-transparent shadow-[0_0_24px_rgba(255,150,40,0.8)]"
            />

            {/* REVLINE rises out of the line */}
            <h1 className="mt-4 flex overflow-hidden font-display text-[17vw] font-bold uppercase italic leading-[1.05] tracking-tight sm:text-9xl">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.55 + i * 0.08,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    i < 3
                      ? "text-[#fdf4df] [text-shadow:0_4px_40px_rgba(0,0,0,0.45)]"
                      : "text-[#ffa03c] [text-shadow:0_0_50px_rgba(255,150,40,0.6)]"
                  }
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-[#f3e6cc]/85 sm:text-sm"
            >
              A Hybrid Training Club
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.8 }}
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
