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

const GEAR: ComponentType<{ className?: string }>[] = [
  Basketball,
  Football,
  TennisRacquet,
  Shuttlecock,
  BaseballBat,
  Basketball,
  Football,
  Shuttlecock,
];

interface DriftItem {
  gear: number;
  left: number; // vw %
  top: number; // vh %
  size: number; // px
  xPath: number[];
  yPath: number[];
  duration: number;
  delay: number;
  opacity: number;
  blurred: boolean;
  parallax: number; // px the item travels over a full page scroll
  spin: number; // deg the item rotates over a full page scroll
  baseRot: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function buildItems(): DriftItem[] {
  return GEAR.map((_, i) => {
    const ax = rand(30, 90);
    return {
      gear: i,
      left: rand(2, 90),
      top: rand(6, 88),
      size: rand(42, 88),
      xPath: [0, rand(-ax, ax), rand(-ax, ax), 0],
      yPath: [0, -rand(15, 50), rand(-15, 50), 0],
      duration: rand(26, 48),
      delay: rand(0, 6),
      opacity: rand(0.4, 0.65),
      blurred: Math.random() < 0.3,
      parallax: rand(-320, 320),
      spin: rand(-200, 200),
      baseRot: rand(-30, 30),
    };
  });
}

function DriftingGear({
  item,
  progress,
}: {
  item: DriftItem;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  // Scroll-driven layer: parallax rise/fall + slow spin as the page moves
  const y = useTransform(progress, [0, 1], [0, item.parallax]);
  const rotate = useTransform(progress, [0, 1], [item.baseRot, item.baseRot + item.spin]);
  const Gear = GEAR[item.gear];

  return (
    <motion.div
      className={`absolute ${item.blurred ? "blur-[2px]" : ""}`}
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: item.size,
        opacity: item.opacity,
        y: reduce ? 0 : y,
        rotate: reduce ? item.baseRot : rotate,
      }}
    >
      {/* Idle drift layered under the scroll response */}
      <motion.div
        animate={reduce ? undefined : { x: item.xPath, y: item.yPath }}
        transition={{
          duration: item.duration,
          delay: item.delay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <Gear className="h-auto w-full drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)]" />
      </motion.div>
    </motion.div>
  );
}

/**
 * Ambient layer: sports gear drifting on random slow paths behind the page,
 * with scroll-linked parallax and rotation so the whole site reacts to
 * scrolling. Randomized per visit; rendered client-only so SSR stays stable.
 */
export function FloatingSports() {
  const [items, setItems] = useState<DriftItem[] | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    setItems(buildItems());
  }, []);

  if (!items) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {items.map((item, i) => (
        <DriftingGear key={i} item={item} progress={progress} />
      ))}
    </div>
  );
}
