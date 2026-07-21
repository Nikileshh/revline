"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

interface StatsStripProps {
  members: number;
  sessionsHosted: number;
  sportsCount: number;
}

/** Proof in numbers — counts up as it scrolls into view. */
export function StatsStrip({ members, sessionsHosted, sportsCount }: StatsStripProps) {
  const stats = [
    members > 0 && { value: members, suffix: "+", label: "Athletes moving with us" },
    sessionsHosted > 0 && { value: sessionsHosted, suffix: "", label: "Sessions hosted" },
    { value: sportsCount, suffix: "", label: "Sports, one crew" },
  ].filter(Boolean) as { value: number; suffix: string; label: string }[];

  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="font-display text-5xl font-bold italic text-primary sm:text-6xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-display text-5xl font-bold italic text-primary sm:text-6xl">
            Sun
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Every single week
          </span>
        </div>
      </div>
    </div>
  );
}
