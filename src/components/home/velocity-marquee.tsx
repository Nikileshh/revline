"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface VelocityMarqueeProps {
  children: React.ReactNode;
  /** Base drift in % of one copy per second */
  baseVelocity?: number;
  className?: string;
}

/**
 * Marquee that idles at a slow drift, then speeds up — and flips direction —
 * with the user's scroll velocity.
 */
export function VelocityMarquee({ children, baseVelocity = -2.5, className }: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  // Four copies rendered; keep x within one copy's width for a seamless loop
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  if (reduce) {
    return (
      <div className={className}>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ x }} className="flex w-max items-center">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-10 pr-10">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
