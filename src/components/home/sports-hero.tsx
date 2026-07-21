"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";
import { StadiumScene } from "@/components/home/stadium-scene";

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
      <StadiumScene />

      {/* Ghost battle-cry across the sky */}
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span
          className="whitespace-nowrap font-display text-[19vw] font-bold uppercase italic leading-none tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1.5px rgba(253,244,223,0.14)" }}
        >
          Show up.
        </span>
      </motion.div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          {...anim(0)}
          className="rounded-full border border-[#ffa03c]/50 bg-black/25 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#ffd9a3] backdrop-blur-sm"
        >
          A Hybrid Training Club
        </motion.p>

        <motion.h1
          {...anim(0.1)}
          className="mt-8 max-w-4xl text-balance font-display text-6xl font-bold uppercase italic leading-[0.95] tracking-tight text-[#fdf4df] [text-shadow:0_4px_36px_rgba(10,4,12,0.55)] sm:text-7xl lg:text-8xl"
        >
          Consistency builds power.
          <br />
          <span className="text-[#ffa03c] [text-shadow:0_0_50px_rgba(255,150,40,0.5)]">
            Community builds purpose.
          </span>
        </motion.h1>

        <motion.p
          {...anim(0.2)}
          className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-[#f3e6cc]/90 [text-shadow:0_2px_16px_rgba(10,4,12,0.5)] sm:text-lg"
        >
          Every weekend we move together — strength, cardio, mobility and endurance,
          blended into one hybrid training lifestyle. Beginner or beast, just show up.
          We&apos;ll handle the rest.
        </motion.p>

        <motion.div {...anim(0.3)} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/events">
            <motion.span
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="flex h-13 items-center gap-3 rounded-full bg-[#d96410] px-8 text-base font-bold uppercase tracking-wide text-[#fff6e6] shadow-[0_0_45px_rgba(255,140,30,0.55)] transition-colors hover:bg-[#f07a1a]"
            >
              Join this weekend&apos;s session
              <ArrowRight className="size-4" aria-hidden />
            </motion.span>
          </Link>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <motion.span
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="flex h-13 items-center gap-2 rounded-full border border-[#f3e6cc]/40 bg-white/10 px-8 text-base font-bold uppercase tracking-wide text-[#fdf4df] backdrop-blur-sm transition-colors hover:border-[#f3e6cc]/70 hover:bg-white/20"
            >
              <InstagramIcon className="size-4" />
              Follow on Instagram
            </motion.span>
          </a>
        </motion.div>

        {memberCount > 0 && (
          <motion.p {...anim(0.4)} className="mt-9 flex items-center gap-2.5 text-sm text-[#f3e6cc]/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ffa03c]/70 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[#ffa03c]" />
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
            <ChevronDown className="size-5 text-[#f3e6cc]/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
