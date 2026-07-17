"use client";

import { motion, useReducedMotion } from "motion/react";

import { RunnerFigure } from "@/components/shared/runner-figure";

const LETTERS = ["R", "E", "V", "L", "I", "N", "E"] as const;
const RUN_DURATION = 2.4;

/**
 * Login hero: a sprinter crosses the strip corner to corner, drawing the
 * maroon "rev line" and revealing the REVLINE letters as it passes each one.
 */
export function RunnerWordmark() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="w-full">
        <p className="text-center font-display text-4xl font-bold uppercase italic tracking-wide sm:text-5xl">
          RevLine
        </p>
        <div className="mt-2 h-0.5 w-full rounded-full bg-primary" />
      </div>
    );
  }

  // Letters reveal while the runner is mid-strip, spread across its pass
  const letterDelay = (i: number) => 0.2 + (i / LETTERS.length) * (RUN_DURATION * 0.72);

  return (
    <div className="relative w-full pb-4 pt-2" role="img" aria-label="RevLine">
      <div className="flex items-end justify-center gap-1 sm:gap-1.5">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: letterDelay(i),
              duration: 0.4,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="font-display text-4xl font-bold uppercase italic tracking-wide sm:text-5xl"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* The rev line, drawn behind the runner */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: RUN_DURATION, ease: "linear" }}
        className="mt-2 h-0.5 w-full origin-left rounded-full bg-primary"
        aria-hidden
      />

      {/* The runner */}
      <motion.div
        initial={{ left: "-12%", opacity: 1 }}
        animate={{ left: ["-12%", "102%", "112%"], opacity: [1, 1, 0] }}
        transition={{ duration: RUN_DURATION * 1.1, times: [0, 0.9, 1], ease: "linear" }}
        className="absolute bottom-3 text-primary"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
        >
          <RunnerFigure />
        </motion.div>
      </motion.div>
    </div>
  );
}
