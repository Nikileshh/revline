"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { RunnerFigure } from "@/components/shared/runner-figure";

/**
 * Sports scroll effect: a maroon track fills across the top of the page as
 * you scroll, with a sprinter running at its leading edge — the end of the
 * page is his finish line.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });
  // Keep the runner fully on-screen at both ends of the track
  const runnerLeft = useTransform(progress, (v) => `calc(${v * 100}vw - ${v * 34}px)`);

  if (reduce) return null;

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary"
        aria-hidden
      />
      <motion.div
        style={{ left: runnerLeft }}
        className="pointer-events-none fixed top-0.5 z-[60] text-primary"
        aria-hidden
      >
        <RunnerFigure className="size-6 drop-shadow-[0_0_6px_color-mix(in_oklab,var(--primary)_60%,transparent)] sm:size-6" />
      </motion.div>
    </>
  );
}
