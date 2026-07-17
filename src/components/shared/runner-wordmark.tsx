"use client";

import { motion, useReducedMotion } from "motion/react";

const LETTERS = ["R", "E", "V", "L", "I", "N", "E"] as const;
const RUN_DURATION = 2.4;

/** Two-frame stick-figure sprinter; frames alternate via CSS (globals.css). */
function RunnerFigure() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-9 sm:size-10"
      aria-hidden
    >
      {/* Frame A — full stride */}
      <g className="runner-frame-a">
        <circle cx={14.5} cy={4} r={2} fill="currentColor" stroke="none" />
        <path d="M13.8 6.5 11.5 12" />
        <path d="M13.2 7.5 16.5 9.5 19 8" />
        <path d="M13.2 7.5 10 9 8.5 7" />
        <path d="M11.5 12 15 14 16.5 18.5" />
        <path d="M11.5 12 8 14.5 4.5 14" />
      </g>
      {/* Frame B — legs passing, knee high */}
      <g className="runner-frame-b">
        <circle cx={14} cy={4.5} r={2} fill="currentColor" stroke="none" />
        <path d="M13.4 7 11.8 12.5" />
        <path d="M12.9 8 15.5 10.5 14.5 12.5" />
        <path d="M12.9 8 10.5 10 11.5 12" />
        <path d="M11.8 12.5 14.5 14.5 13.5 19" />
        <path d="M11.8 12.5 9.5 15.5 10.5 19.5" />
      </g>
    </svg>
  );
}

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
