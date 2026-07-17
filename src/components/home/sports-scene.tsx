"use client";

import { motion, useReducedMotion } from "motion/react";

function Basketball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="47" fill="#E0873F" />
      <path
        d="M3 50h94M50 3v94M16 16c15 14 15 54 0 68M84 16c-15 14-15 54 0 68"
        stroke="#AD5F22"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#AD5F22" strokeWidth="2.5" />
    </svg>
  );
}

function Football({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#3A4A63" strokeWidth="2.5" />
      <polygon points="50,32 66,44 60,62 40,62 34,44" fill="#2D3A52" />
      <path
        d="M50 32V15M66 44l16-7M60 62l11 14M40 62L29 76M34 44l-16-7"
        stroke="#2D3A52"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TennisRacquet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 122" className={className} aria-hidden>
      <ellipse cx="30" cy="32" rx="23" ry="29" fill="rgba(255,255,255,0.75)" stroke="#2D3A52" strokeWidth="4" />
      <path
        d="M14 18v28M22 12v40M30 10v44M38 12v40M46 18v28M10 24h40M8 34h44M10 44h40M14 52h32"
        stroke="#2D3A52"
        strokeWidth="1"
        opacity="0.45"
      />
      <path d="M23 59l4 16M37 59l-4 16" stroke="#2D3A52" strokeWidth="4" strokeLinecap="round" />
      <rect x="25" y="74" width="10" height="40" rx="5" fill="#8E3B45" />
    </svg>
  );
}

function Shuttlecock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <path d="M28 70 L12 16 L68 16 L52 70 Z" fill="rgba(255,255,255,0.85)" stroke="#3A4A63" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 70V16M31 70L21 16M49 70l10-54" stroke="#3A4A63" strokeWidth="1.5" opacity="0.6" />
      <path d="M18 36h44M23 52h34" stroke="#3A4A63" strokeWidth="1.5" opacity="0.6" />
      <circle cx="40" cy="80" r="12" fill="#F4E9DA" stroke="#C9B18C" strokeWidth="2.5" />
    </svg>
  );
}

function BaseballBat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 140" className={className} aria-hidden>
      <path
        d="M20 5c11 0 12 34 7 66-2 14-3 26-3 40h-8c0-14-1-26-3-40C8 39 9 5 20 5Z"
        fill="#C89B6B"
        stroke="#9A7145"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="20" cy="116" rx="9" ry="5.5" fill="#9A7145" />
    </svg>
  );
}

interface FloatProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  duration?: number;
  delay?: number;
  drift?: number;
}

function Float({ children, className, rotate = 0, duration = 7, delay = 0, drift = 14 }: FloatProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ rotate }}
      animate={
        reduce
          ? undefined
          : { y: [0, -drift, 0], rotate: [rotate - 2, rotate + 2, rotate - 2] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}

/**
 * Light glassmorphism backdrop for the hero: soft gradient field with court
 * markings and floating sports equipment (stands in for the spec's video).
 */
export function SportsScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#f2f4f8] via-[#f7f3ec] to-[#e9efe9]">
      {/* Soft color blobs */}
      <div className="absolute -left-24 top-1/4 size-96 rounded-full bg-[rgba(30,50,90,0.10)] blur-3xl" />
      <div className="absolute -right-20 top-1/2 size-96 rounded-full bg-[rgba(142,59,69,0.10)] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-[rgba(70,120,80,0.10)] blur-3xl" />

      {/* Court markings */}
      <div className="absolute -bottom-56 left-1/2 size-[620px] -translate-x-1/2 rounded-full border-[3px] border-white/70" />
      <div className="absolute -bottom-56 left-1/2 size-[380px] -translate-x-1/2 rounded-full border-[3px] border-white/50" />
      <div className="absolute inset-x-0 bottom-40 border-t-2 border-white/50" />

      {/* Floating equipment */}
      <Float className="absolute left-[5%] top-[16%] w-14 sm:w-16 md:w-20" rotate={-18} duration={7.5}>
        <Shuttlecock className="h-auto w-full drop-shadow-lg" />
      </Float>
      <Float className="absolute bottom-[30%] left-[8%] w-20 sm:w-24 md:w-28 lg:w-32" rotate={8} duration={8.5} delay={0.8}>
        <Basketball className="h-auto w-full drop-shadow-xl" />
      </Float>
      <Float className="absolute right-[6%] top-[13%] w-14 sm:w-16 md:w-24" rotate={24} duration={7} delay={0.4}>
        <TennisRacquet className="h-auto w-full drop-shadow-lg" />
      </Float>
      <Float className="absolute bottom-[32%] right-[9%] w-16 sm:w-20 md:w-24 lg:w-28" rotate={-10} duration={9} delay={1.2}>
        <Football className="h-auto w-full drop-shadow-xl" />
      </Float>
      <Float className="hidden md:block absolute left-[26%] top-[7%] w-8 lg:w-10" rotate={38} duration={8} delay={1.6} drift={10}>
        <BaseballBat className="h-auto w-full drop-shadow-lg" />
      </Float>
    </div>
  );
}
