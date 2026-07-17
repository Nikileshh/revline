"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  Basketball,
  BaseballBat,
  Football,
  Shuttlecock,
  TennisRacquet,
} from "@/components/home/sports-gear";

/**
 * Curated slots along the page edges — the centre column (where all the
 * text lives) is always left clear, so the gear never congests or overlaps
 * content. Each visit adds only a small jitter around these anchors.
 */
const SLOTS: {
  Gear: ComponentType<{ className?: string }>;
  left: number; // vw %
  top: number; // vh %
  size: number; // px
  parallax: number; // px over a full page scroll
  rotate: number;
}[] = [
  { Gear: Basketball, left: 5, top: 16, size: 60, parallax: -110, rotate: 8 },
  { Gear: TennisRacquet, left: 89, top: 12, size: 52, parallax: -70, rotate: 24 },
  { Gear: Shuttlecock, left: 8, top: 58, size: 44, parallax: -140, rotate: -16 },
  { Gear: Football, left: 90, top: 52, size: 58, parallax: -90, rotate: -8 },
  { Gear: BaseballBat, left: 13, top: 86, size: 40, parallax: -60, rotate: 38 },
  { Gear: Basketball, left: 84, top: 87, size: 44, parallax: -130, rotate: -12 },
];

interface Placed {
  slot: number;
  left: number;
  top: number;
  delay: number;
}

function FloatingItem({ item, progress }: { item: Placed; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const slot = SLOTS[item.slot];
  const y = useTransform(progress, [0, 1], [0, slot.parallax]);
  const Gear = slot.Gear;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: slot.size,
        opacity: 0.45,
        y: reduce ? 0 : y,
        rotate: slot.rotate,
      }}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : { y: [0, -12, 0], rotate: [-3, 3, -3] }
        }
        transition={{
          duration: 9 + item.slot * 1.5,
          delay: item.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Gear className="h-auto w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]" />
      </motion.div>
    </motion.div>
  );
}

/** Ambient gear along the page edges with soft drift and scroll parallax. */
export function FloatingSports() {
  const [items, setItems] = useState<Placed[] | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    // Small jitter around each anchor so visits vary without ever clustering
    setItems(
      SLOTS.map((slot, i) => ({
        slot: i,
        left: slot.left + (Math.random() * 4 - 2),
        top: slot.top + (Math.random() * 4 - 2),
        delay: Math.random() * 4,
      })),
    );
  }, []);

  if (!items) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {items.map((item) => (
        <FloatingItem key={item.slot} item={item} progress={progress} />
      ))}
    </div>
  );
}
