"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";
import { Button } from "@/components/ui/button";

const SPORTS = ["Running", "Football", "Turf", "Trekking", "Swimming", "Workouts"];

interface HeroProps {
  instagramUrl: string;
}

export function Hero({ instagramUrl }: HeroProps) {
  const reduce = useReducedMotion();
  const anim = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
        };

  return (
    <section className="relative overflow-hidden">
      {/* Gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pb-28 sm:pt-32">
        <motion.p
          {...anim(0)}
          className="mb-6 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          A Hybrid Training Club
        </motion.p>

        <motion.h1
          {...anim(0.1)}
          className="max-w-4xl text-balance font-display text-6xl font-bold uppercase italic leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        >
          Consistency builds power.
          <br />
          <span className="text-primary">Community builds purpose.</span>
        </motion.h1>

        <motion.p
          {...anim(0.2)}
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Every weekend we move together — strength, cardio, mobility and endurance,
          blended into one hybrid training lifestyle. Beginner or beast, just show up.
          We&apos;ll handle the rest.
        </motion.p>

        <motion.div {...anim(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="/events">
              Join this weekend&apos;s session
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="size-4" />
              Follow on Instagram
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Sports ticker */}
      <div className="border-y border-border/60 bg-card/50 py-4" aria-hidden>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 sm:px-6">
          {SPORTS.map((sport) => (
            <span
              key={sport}
              className="font-display text-lg font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              {sport}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
