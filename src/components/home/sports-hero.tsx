"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";
import { Button } from "@/components/ui/button";

interface SportsHeroProps {
  instagramUrl: string;
  memberCount: number;
}

export function SportsHero({ instagramUrl, memberCount }: SportsHeroProps) {
  const reduce = useReducedMotion();
  const display =
    memberCount >= 1000 ? `${(memberCount / 1000).toFixed(1)}K` : String(memberCount);

  const anim = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
        };

  return (
    <section className="relative overflow-hidden">
      {/* One confident orange glow, nothing else fighting the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_55%_50%_at_50%_-12%,color-mix(in_oklab,var(--primary)_32%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-px w-[min(90%,64rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          {...anim(0)}
          className="rounded-full border border-primary/40 bg-primary/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          A Hybrid Training Club
        </motion.p>

        <motion.h1
          {...anim(0.1)}
          className="mt-8 max-w-4xl text-balance font-display text-6xl font-bold uppercase italic leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Consistency builds power.
          <br />
          <span className="text-primary">Community builds purpose.</span>
        </motion.h1>

        <motion.p
          {...anim(0.2)}
          className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/65 sm:text-lg"
        >
          Every weekend we move together — strength, cardio, mobility and endurance,
          blended into one hybrid training lifestyle. Beginner or beast, just show up.
          We&apos;ll handle the rest.
        </motion.p>

        <motion.div {...anim(0.3)} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-13 rounded-full px-8 text-base font-bold uppercase tracking-wide">
            <Link href="/events">
              Join this weekend&apos;s session
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-13 rounded-full border-white/20 bg-white/[0.04] px-8 text-base font-bold uppercase tracking-wide hover:border-white/40"
          >
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="size-4" />
              Follow on Instagram
            </a>
          </Button>
        </motion.div>

        {memberCount > 0 && (
          <motion.p {...anim(0.4)} className="mt-9 flex items-center gap-2.5 text-sm text-white/50">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {display} active members
          </motion.p>
        )}

        <motion.div
          aria-hidden
          className="absolute bottom-6"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-5 text-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
