"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

const LINES = [
  "You vs yesterday.",
  "Rain or shine. We move.",
  "Beginner or beast — show up.",
] as const;

function ChallengeLine({
  text,
  index,
  progress,
}: {
  text: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each line ignites as it crosses the middle of the band
  const start = 0.12 + index * 0.16;
  const opacity = useTransform(progress, [start, start + 0.14], [0.18, 1]);
  const x = useTransform(progress, [start, start + 0.14], [24, 0]);

  return (
    <motion.p
      style={{ opacity, x }}
      className="font-display text-5xl font-bold uppercase italic leading-[1.04] tracking-tight text-[oklch(0.97_0.02_84)] sm:text-6xl lg:text-7xl"
    >
      {text.split("—").map((part, i) =>
        i === 0 ? (
          part
        ) : (
          <span key={i} className="text-primary">
            —{part}
          </span>
        ),
      )}
    </motion.p>
  );
}

/**
 * Cinematic dark band on the light site — the stadium-tunnel moment. Big
 * challenge statements ignite line by line as you scroll through, ending in
 * a dare to register.
 */
export function Challenge() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[oklch(0.13_0.05_330)] py-24 sm:py-32"
    >
      {/* Tunnel lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(20,10,4,0.5))]"
      />
      <div aria-hidden className="film-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          The standard
        </p>

        {reduce ? (
          <div className="flex flex-col gap-6">
            {LINES.map((line) => (
              <p
                key={line}
                className="font-display text-5xl font-bold uppercase italic leading-[1.04] tracking-tight text-[oklch(0.97_0.02_84)] sm:text-6xl lg:text-7xl"
              >
                {line}
              </p>
            ))}
          </div>
        ) : (
          LINES.map((line, i) => (
            <ChallengeLine key={line} text={line} index={i} progress={scrollYProgress} />
          ))
        )}

        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-[oklch(0.9_0.03_80)]/80">
            The hardest rep is showing up the first time. After that, the crew
            carries you.
          </p>
          <Link
            href="/events"
            className="group flex h-13 shrink-0 items-center gap-3 rounded-full bg-primary pl-6 pr-5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_0_45px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            Accept the challenge
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
