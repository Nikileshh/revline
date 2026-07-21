"use client";

import { useEffect, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  Basketball,
  BaseballBat,
  Football,
  Shuttlecock,
  TennisRacquet,
} from "@/components/home/sports-gear";

/**
 * Each piece travels the full viewport left → right on its own lane while
 * tracing slow circles (sine-wave bob + continuous roll), then re-enters
 * from the left. Lanes are spread vertically so pieces never bunch up.
 */
const LANES: {
  Gear: ComponentType<{ className?: string }>;
  top: number; // vh %
  size: number; // px
  duration: number; // s per full crossing
  circle: number; // px radius of the vertical loop
  spin: boolean; // roll while travelling (balls) vs sway (gear with handles)
}[] = [
  { Gear: Basketball, top: 12, size: 54, duration: 52, circle: 34, spin: true },
  { Gear: TennisRacquet, top: 28, size: 48, duration: 68, circle: 26, spin: false },
  { Gear: Football, top: 44, size: 50, duration: 58, circle: 32, spin: true },
  { Gear: Shuttlecock, top: 62, size: 40, duration: 47, circle: 28, spin: false },
  { Gear: BaseballBat, top: 76, size: 38, duration: 74, circle: 22, spin: false },
  { Gear: Basketball, top: 88, size: 40, duration: 63, circle: 26, spin: true },
];

function TravellingGear({ lane, offset }: { lane: (typeof LANES)[number]; offset: number }) {
  const reduce = useReducedMotion();
  const Gear = lane.Gear;

  if (reduce) {
    return (
      <div
        className="absolute opacity-30"
        style={{ left: `${10 + offset * 60}%`, top: `${lane.top}%`, width: lane.size }}
      >
        <Gear className="h-auto w-full" />
      </div>
    );
  }

  const c = lane.circle;

  return (
    <motion.div
      className="absolute"
      style={{ left: "-8vw", top: `${lane.top}%`, width: lane.size, opacity: 0.42 }}
      animate={{ x: ["0vw", "120vw"] }}
      transition={{
        duration: lane.duration,
        repeat: Infinity,
        ease: "linear",
        delay: -offset * lane.duration,
      }}
    >
      {/* Circular path: vertical sine offset + phase-shifted sway */}
      <motion.div
        animate={{ y: [0, -c, 0, c, 0], x: [0, c * 0.5, 0, -c * 0.5, 0] }}
        transition={{
          duration: lane.duration / 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={lane.spin ? { rotate: 360 } : { rotate: [-10, 10, -10] }}
          transition={
            lane.spin
              ? { duration: 14, repeat: Infinity, ease: "linear" }
              : { duration: lane.duration / 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Gear className="h-auto w-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.5)]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Ambient gear parading across the page on circular paths. */
export function FloatingSports() {
  const [offsets, setOffsets] = useState<number[] | null>(null);

  useEffect(() => {
    // Random starting progress per lane so the parade is spread out
    // immediately instead of everyone entering from the left at once.
    setOffsets(LANES.map(() => Math.random()));
  }, []);

  if (!offsets) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {LANES.map((lane, i) => (
        <TravellingGear key={i} lane={lane} offset={offsets[i]} />
      ))}
    </div>
  );
}
