"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";

import { InstagramIcon } from "@/components/shared/instagram-icon";
import { SportsScene } from "@/components/home/sports-scene";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/crew", label: "Crew" },
  { href: "/terms", label: "Terms" },
] as const;

function HeroNavbar() {
  return (
    <nav className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-10">
      <div className="hidden flex-1 md:block">
        <Link
          href="/"
          className="font-display text-2xl font-bold uppercase italic tracking-wide text-[rgba(30,50,90,0.9)]"
        >
          RevLine
        </Link>
      </div>

      <ul className="hidden items-center gap-8 text-sm font-normal text-[rgb(45,45,45)] md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-70"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <Link href="/" className="text-xl tracking-tighter text-[rgba(30,50,90,0.9)]">
          RevLine
        </Link>
      </div>

      <div className="flex flex-1 justify-end">
        <Link href="/events">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 rounded-full bg-[rgba(30,50,90,0.8)] py-1.5 pl-2 pr-4 text-white transition-colors hover:bg-[rgba(30,50,90,1)] md:gap-3 md:py-2 md:pr-6"
          >
            <span className="flex items-center justify-center rounded-full bg-white/20 p-1 md:p-1.5">
              <ArrowUpRight className="h-4 w-4 text-white md:h-5 md:w-5" aria-hidden />
            </span>
            <span className="text-xs font-normal md:text-sm">Join a Session</span>
          </motion.span>
        </Link>
      </div>
    </nav>
  );
}

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/60 px-4 py-2 backdrop-blur-md"
    >
      <Sparkles className="h-4 w-4 text-[rgba(30,50,90,0.8)]" aria-hidden />
      <span className="text-[14px] font-normal text-[rgba(30,50,90,0.9)]">
        A Hybrid Training Club
      </span>
    </motion.div>
  );
}

function BottomLeftCard({ memberCount, whatsappUrl }: { memberCount: number; whatsappUrl: string }) {
  const display =
    memberCount >= 1000 ? `${(memberCount / 1000).toFixed(1)}K` : String(memberCount);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 left-auto right-4 flex w-fit min-w-[140px] flex-col gap-2 rounded-[1.2rem] bg-white/30 p-3 backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:min-w-[150px] md:rounded-[1.5rem] md:p-4 lg:bottom-10 lg:left-10 lg:gap-3 lg:rounded-[2.2rem] lg:p-5 lg:min-w-[180px]"
    >
      <div className="flex flex-col">
        <span className="text-2xl font-normal tracking-tight text-[rgba(30,50,90,0.9)] md:text-3xl">
          {display}
        </span>
        <span className="text-[10px] font-normal uppercase tracking-wider text-[rgba(30,50,90,0.6)] md:text-[12px]">
          Active members
        </span>
      </div>
      <a href={whatsappUrl || "/events"} target={whatsappUrl ? "_blank" : undefined} rel="noopener noreferrer">
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 self-start rounded-full bg-white py-1.5 pl-1.5 pr-5 transition-colors hover:bg-white/90"
        >
          <span className="flex items-center justify-center rounded-full bg-[rgba(30,50,90,0.1)] p-1">
            <ArrowUpRight className="h-4 w-4 text-[rgba(30,50,90,0.9)]" aria-hidden />
          </span>
          <span className="text-[14px] font-normal text-[rgba(30,50,90,0.9)]">
            Join the WhatsApp community
          </span>
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
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-0 right-0 flex items-center gap-3 rounded-tl-[1.5rem] bg-[#f0f0f0] p-3 pl-8 pt-5 sm:gap-4 sm:rounded-tl-[2rem] sm:p-4 sm:pl-10 sm:pt-6 md:gap-6 md:rounded-tl-[3.5rem] md:p-6 md:pl-14 md:pt-8"
    >
      {/* Top intersection mask */}
      <div className="pointer-events-none absolute -top-[1.5rem] right-0 h-[1.5rem] w-[1.5rem] sm:-top-[2rem] sm:h-[2rem] sm:w-[2rem] md:-top-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f0f0f0" />
        </svg>
      </div>
      {/* Left intersection mask */}
      <div className="pointer-events-none absolute -left-[1.5rem] bottom-0 h-[1.5rem] w-[1.5rem] sm:-left-[2rem] sm:h-[2rem] sm:w-[2rem] md:-left-[3.5rem] md:h-[3.5rem] md:w-[3.5rem]">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#f0f0f0" />
        </svg>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(30,50,90,0.1)] bg-[rgba(30,50,90,0.05)] md:h-14 md:w-14">
        <ArrowUpRight className="h-5 w-5 text-[rgba(30,50,90,0.8)]" aria-hidden />
      </div>
      <div className="flex flex-col">
        <span className="text-[16px] font-normal text-[rgba(30,50,90,0.95)] md:text-[20px]">
          Upcoming sessions
        </span>
        <Link
          href="/events"
          className="flex cursor-pointer items-center gap-1 text-[rgba(30,50,90,0.6)] transition-colors hover:text-[rgba(30,50,90,0.8)]"
        >
          <span className="text-[12px] font-normal md:text-[15px]">All events</span>
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
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f0f0f0] p-3 md:p-5">
      <section className="group relative flex h-full w-full max-w-[1536px] flex-col items-center overflow-hidden rounded-[1.5rem] bg-white/10 shadow-none md:rounded-[3rem]">
        <SportsScene />

        <div className="relative z-10 flex h-full w-full flex-col items-center">
          <HeroNavbar />

          <div className="flex w-full max-w-4xl flex-col items-center px-6 pt-8 text-center">
            <HeroBadge />

            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-2 text-balance text-4xl font-normal leading-[1.05] tracking-tight text-[#5E6470] sm:text-5xl md:text-6xl lg:text-[64px]"
            >
              Consistency builds power.
              <br />
              <span className="text-[rgba(30,50,90,0.9)]">Community builds purpose.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl text-sm font-normal leading-relaxed text-[#5E6470] opacity-80 sm:text-base md:text-lg"
            >
              Every weekend we move together — strength, cardio, mobility and endurance,
              blended into one hybrid training lifestyle. Beginner or beast, just show up.
              We&apos;ll handle the rest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link href="/events">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.85)] py-2 pl-2 pr-6 text-white transition-colors hover:bg-[rgba(30,50,90,1)]"
                >
                  <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5">
                    <ArrowUpRight className="h-5 w-5 text-white" aria-hidden />
                  </span>
                  <span className="text-sm font-normal">Join this weekend&apos;s session</span>
                </motion.span>
              </Link>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-6 py-2.5 text-[rgba(30,50,90,0.9)] backdrop-blur-md transition-colors hover:bg-white/80"
                >
                  <InstagramIcon className="size-4" />
                  <span className="text-sm font-normal">Follow on Instagram</span>
                </motion.span>
              </a>
            </motion.div>
          </div>

          <BottomLeftCard memberCount={memberCount} whatsappUrl={whatsappUrl} />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  );
}
