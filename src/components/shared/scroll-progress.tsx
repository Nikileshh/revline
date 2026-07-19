"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { RunnerFigure } from "@/components/shared/runner-figure";

function FinishFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 24" className={className} aria-hidden>
      <rect x="1" y="1" width="2" height="22" rx="1" fill="currentColor" opacity="0.6" />
      {[0, 1, 2].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={4 + col * 5}
            y={2 + row * 4}
            width="5"
            height="4"
            fill="currentColor"
            opacity={(col + row) % 2 === 0 ? 0.9 : 0.25}
          />
        )),
      )}
    </svg>
  );
}

/**
 * Sports scroll effect: the top of the page is a running track — lane
 * markings, an orange fill that grows as you scroll, the sprinter at its
 * leading edge, and a checkered finish flag that appears near the end.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });
  // Keep the runner fully on-screen at both ends of the track
  const runnerLeft = useTransform(progress, (v) => `calc(${v * 100}vw - ${v * 34}px)`);
  const flagOpacity = useTransform(progress, [0.78, 0.97], [0, 1]);

  if (reduce) return null;

  return (
    <>
      {/* Track bed with lane dashes */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-1.5 bg-foreground/10 [background-image:repeating-linear-gradient(90deg,transparent_0px,transparent_22px,color-mix(in_oklab,var(--foreground)_28%,transparent)_22px,color-mix(in_oklab,var(--foreground)_28%,transparent)_30px)] [background-position:0_center] [background-size:auto_2px] bg-no-repeat"
        style={{ backgroundPositionY: "50%" }}
      />
      {/* Orange lane fill */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-1.5 origin-left bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
        aria-hidden
      />
      {/* The sprinter */}
      <motion.div
        style={{ left: runnerLeft }}
        className="pointer-events-none fixed top-1.5 z-[60] text-primary"
        aria-hidden
      >
        <RunnerFigure className="size-6 drop-shadow-[0_0_6px_color-mix(in_oklab,var(--primary)_60%,transparent)] sm:size-6" />
      </motion.div>
      {/* Finish line flag, revealed on the final stretch */}
      <motion.div
        style={{ opacity: flagOpacity }}
        className="pointer-events-none fixed right-1.5 top-1.5 z-[60] text-foreground"
        aria-hidden
      >
        <FinishFlag className="h-6 w-5" />
      </motion.div>
    </>
  );
}
