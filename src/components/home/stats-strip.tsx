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
}

/** Two headline numbers — admin overrides win, else the live count. */
export function StatsStrip({ members, sessionsHosted }: StatsStripProps) {
  const stats = [
    { value: members, suffix: "+", label: "Athletes joined us so far" },
    { value: sessionsHosted, suffix: "+", label: "Sessions hosted" },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="font-power text-6xl text-primary [transform:skewX(-6deg)] sm:text-7xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
