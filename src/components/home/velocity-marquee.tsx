"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface VelocityMarqueeProps {
  children: React.ReactNode;
  /** Base drift in % of one copy per second. Positive = left→right, negative = right→left. */
  baseVelocity?: number;
  className?: string;
}

/**
 * Marquee that drifts at a constant speed, independent of page scroll.
 */
export function VelocityMarquee({ children, baseVelocity = -2.5, className }: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    baseX.set(baseX.get() + baseVelocity * (delta / 1000));
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
