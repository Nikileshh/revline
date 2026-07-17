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
  rotPath: number[];
  duration: number;
  delay: number;
  opacity: number;
  blurred: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function buildItems(): DriftItem[] {
  return GEAR.map((_, i) => {
    const ax = rand(40, 110);
    const ay = rand(50, 130);
    const baseRot = rand(-30, 30);
    return {
      gear: i,
      left: rand(2, 90),
      top: rand(6, 88),
      size: rand(38, 78),
      xPath: [0, rand(-ax, ax), rand(-ax, ax), rand(-ax, ax)],
      yPath: [0, -rand(20, ay), rand(-20, ay), -rand(10, ay)],
      rotPath: [baseRot, baseRot + rand(-25, 25), baseRot + rand(-25, 25), baseRot],
      duration: rand(28, 55),
      delay: rand(0, 8),
      opacity: rand(0.35, 0.6),
      blurred: Math.random() < 0.35,
    };
  });
}

/**
 * Ambient layer: shaded sports gear drifting on random slow paths across the
 * whole page, behind the content. Randomized per visit, client-only so SSR
 * markup stays stable.
 */
export function FloatingSports() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<DriftItem[] | null>(null);

  useEffect(() => {
    setItems(buildItems());
  }, []);

  if (!items) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {items.map((item, i) => {
        const Gear = GEAR[item.gear];
        return (
          <motion.div
            key={i}
            className={`absolute ${item.blurred ? "blur-[2px]" : ""}`}
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: item.size,
              opacity: item.opacity,
            }}
            animate={
              reduce
                ? undefined
                : {
                    x: item.xPath,
                    y: item.yPath,
                    rotate: item.rotPath,
                  }
            }
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
        );
      })}
    </div>
  );
}
