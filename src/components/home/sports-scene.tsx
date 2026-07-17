"use client";

import { motion, useReducedMotion } from "motion/react";

import { Basketball, Football, TennisRacquet } from "@/components/home/sports-gear";

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

interface FloatProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  duration?: number;
  delay?: number;
  drift?: number;
}

/** Slow, heavy drift — objects hanging in still air, not bouncing. */
function Float({ children, className, rotate = 0, duration = 14, delay = 0, drift = 16 }: FloatProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ rotate }}
      animate={
        reduce
          ? undefined
          : { y: [0, -drift, 0], rotate: [rotate - 1.5, rotate + 1.5, rotate - 1.5] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}

const DUST = [
  { left: "16%", top: "58%", size: 2, duration: 13, delay: 0 },
  { left: "27%", top: "76%", size: 2, duration: 16, delay: 3 },
  { left: "44%", top: "64%", size: 1.5, duration: 14, delay: 6 },
  { left: "58%", top: "80%", size: 2, duration: 17, delay: 1 },
  { left: "71%", top: "62%", size: 1.5, duration: 15, delay: 5 },
  { left: "84%", top: "74%", size: 2, duration: 14, delay: 8 },
] as const;

function Dust() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      {DUST.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          animate={{ y: [0, -110], opacity: [0, 0.3, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
      ))}
    </>
  );
}

/** A soft volumetric floodlight beam. */
function Beam({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 9, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/* The scene                                                           */
/* ------------------------------------------------------------------ */

/**
 * Cinematic arena: black frame cut by maroon floodlight beams and haze,
 * fully-lit equipment hanging in the light, dust, film grain and a vignette.
 * Built to keep white type razor-legible.
 */
export function SportsScene() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0708]">
      {/* Slow push-in (ken burns) */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Overhead key light + maroon wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_38%_at_50%_-8%,rgba(255,255,255,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_115%,color-mix(in_oklab,var(--primary)_45%,transparent),transparent_70%)]" />

        {/* Floodlight beams */}
        <Beam className="absolute -top-1/4 left-[6%] h-[150%] w-[26%] rotate-[16deg] bg-gradient-to-b from-[color-mix(in_oklab,var(--primary)_38%,transparent)] via-[color-mix(in_oklab,var(--primary)_10%,transparent)] to-transparent blur-2xl" />
        <Beam
          className="absolute -top-1/4 right-[8%] h-[150%] w-[24%] -rotate-[14deg] bg-gradient-to-b from-[color-mix(in_oklab,var(--primary)_30%,transparent)] via-transparent to-transparent blur-2xl"
          delay={3}
        />
        <Beam
          className="absolute -top-1/3 left-[38%] h-[160%] w-[22%] rotate-[2deg] bg-gradient-to-b from-white/[0.09] via-transparent to-transparent blur-2xl"
          delay={5}
        />

        {/* Drifting haze */}
        <motion.div
          className="absolute bottom-[8%] left-[10%] h-64 w-[55%] rounded-full bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] blur-3xl"
          animate={reduce ? undefined : { x: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="absolute bottom-[20%] right-[5%] h-56 w-[45%] rounded-full bg-white/[0.05] blur-3xl"
          animate={reduce ? undefined : { x: [0, -50, 0] }}
          transition={{ duration: 26, delay: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        {/* Track lines, barely lit */}
        <div className="absolute -bottom-72 left-1/2 size-[760px] -translate-x-1/2 rounded-full border-2 border-white/[0.06]" />
        <div className="absolute -bottom-72 left-1/2 size-[470px] -translate-x-1/2 rounded-full border-2 border-[color-mix(in_oklab,var(--primary)_35%,transparent)] opacity-30" />

        {/* Equipment under the floodlights — fully lit, clearly visible */}
        <Float
          className="absolute left-[4%] bottom-[24%] w-28 drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)] sm:w-32 md:w-44 lg:w-52"
          rotate={10}
          duration={15}
          delay={0.6}
          drift={20}
        >
          <Basketball className="h-auto w-full" />
        </Float>
        <Float
          className="absolute right-[5%] bottom-[26%] w-24 drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)] sm:w-28 md:w-36 lg:w-40"
          rotate={-8}
          duration={16}
          delay={1.4}
          drift={18}
        >
          <Football className="h-auto w-full" />
        </Float>
        <Float
          className="absolute right-[16%] top-[9%] w-16 opacity-90 drop-shadow-[0_20px_28px_rgba(0,0,0,0.7)] md:w-24 lg:w-28"
          rotate={26}
          duration={17}
          delay={0.2}
        >
          <TennisRacquet className="h-auto w-full" />
        </Float>

        <Dust />
      </motion.div>

      {/* Slow anamorphic light sweep */}
      {!reduce && (
        <motion.div
          className="absolute inset-y-0 w-[40%] rotate-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent"
          initial={{ left: "-55%" }}
          animate={{ left: "125%" }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
          aria-hidden
        />
      )}

      {/* Film layer: vignette then grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.5))]" />
      <div className="film-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
