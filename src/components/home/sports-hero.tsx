"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";
import { SportsScene } from "@/components/home/sports-scene";

/** Cinematic mask reveal: the line rises out of an invisible slot. */
function RevealLine({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function BottomLeftCard({ memberCount, whatsappUrl }: { memberCount: number; whatsappUrl: string }) {
  const display =
    memberCount >= 1000 ? `${(memberCount / 1000).toFixed(1)}K` : String(memberCount);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="absolute bottom-28 left-auto right-4 flex w-fit min-w-[150px] flex-col gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:rounded-[1.5rem] lg:bottom-10 lg:left-10 lg:min-w-[190px] lg:rounded-[2rem] lg:p-5"
    >
      <div className="flex flex-col">
        <span className="font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
          {display}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 md:text-[11px]">
          Active members
        </span>
      </div>
      <a
        href={whatsappUrl || "/events"}
        target={whatsappUrl ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 self-start rounded-full bg-primary py-1.5 pl-1.5 pr-4 text-white shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_85%,white)]"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-1">
            <ArrowUpRight className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span className="text-[13px] font-semibold">Join the WhatsApp community</span>
        </motion.span>
      </a>
    </motion.div>
  );
}

function BottomRightCorner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.05 }}
      className="absolute bottom-0 right-0 flex items-center gap-3 rounded-tl-[1.5rem] bg-background p-3 pl-8 pt-5 sm:gap-4 sm:rounded-tl-[2rem] sm:p-4 sm:pl-10 sm:pt-6 md:gap-6 md:rounded-tl-[3.5rem] md:p-6 md:pl-14 md:pt-8"
    >
      {/* Top intersection mask */}
      <div className="pointer-events-none absolute -top-[1.5rem] right-0 h-[1.5rem] w-[1.5rem] sm:-top-[2rem] sm:h-[2rem] sm:w-[2rem] md:-top-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="var(--background)" />
        </svg>
      </div>
      {/* Left intersection mask */}
      <div className="pointer-events-none absolute -left-[1.5rem] bottom-0 h-[1.5rem] w-[1.5rem] sm:-left-[2rem] sm:h-[2rem] sm:w-[2rem] md:-left-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="var(--background)" />
        </svg>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/15 md:h-14 md:w-14">
        <ArrowUpRight className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold uppercase tracking-wide text-white md:text-xl">
          Upcoming sessions
        </span>
        <Link
          href="/events"
          className="flex cursor-pointer items-center gap-1 text-white/60 transition-colors hover:text-primary"
        >
          <span className="text-[12px] font-medium md:text-[14px]">All events</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </motion.div>
  );
}

interface SportsHeroProps {
  instagramUrl: string;
  whatsappUrl: string;
  memberCount: number;
}

export function SportsHero({ instagramUrl, whatsappUrl, memberCount }: SportsHeroProps) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-[calc(100svh-4rem)] min-h-[560px] w-full items-center justify-center bg-background p-3 md:p-5"
    >
      {/* Maroon under-glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-6 rounded-[3rem] bg-primary/20 blur-3xl"
      />

      <section className="group relative flex h-full w-full max-w-[1536px] flex-col items-center overflow-hidden rounded-[1.5rem] border border-white/10 md:rounded-[3rem]">
        <motion.div style={reduce ? undefined : { y: sceneY }} className="absolute inset-0">
          <SportsScene />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pb-24 text-center md:pb-16"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              A Hybrid Training Club
            </span>
          </motion.div>

          <h1 className="max-w-5xl text-balance font-display text-6xl font-bold uppercase italic leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            <RevealLine delay={0.15}>Consistency builds power.</RevealLine>
            <RevealLine delay={0.32} className="text-primary [text-shadow:0_0_60px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
              Community builds purpose.
            </RevealLine>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Every weekend we move together — strength, cardio, mobility and endurance,
            blended into one hybrid training lifestyle. Beginner or beast, just show up.
            We&apos;ll handle the rest.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link href="/events">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex h-12 items-center gap-3 rounded-full bg-primary pl-2 pr-7 text-white shadow-[0_0_45px_color-mix(in_oklab,var(--primary)_55%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_85%,white)]"
              >
                <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5">
                  <ArrowUpRight className="h-5 w-5 text-white" aria-hidden />
                </span>
                <span className="text-sm font-bold uppercase tracking-wide">
                  Join this weekend&apos;s session
                </span>
              </motion.span>
            </Link>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex h-12 items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-7 text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/15"
              >
                <InstagramIcon className="size-4" />
                <span className="text-sm font-bold uppercase tracking-wide">
                  Follow on Instagram
                </span>
              </motion.span>
            </a>
          </motion.div>
        </motion.div>

        <BottomLeftCard memberCount={memberCount} whatsappUrl={whatsappUrl} />
        <BottomRightCorner />
      </section>
    </div>
  );
}
