"use client";

import { motion, useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ */
/* Equipment as rim-lit silhouettes — objects in arena shadow          */
/* ------------------------------------------------------------------ */

function BasketballSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="rim-bb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="body-bb" cx="30%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#2a2023" />
          <stop offset="100%" stopColor="#120e10" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#body-bb)" stroke="url(#rim-bb)" strokeWidth="2.5" />
      <path
        d="M4 50h92M50 4v92M17 17c14 13 14 53 0 66M83 17c-14 13-14 53 0 66"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.08"
      />
      <ellipse cx="34" cy="26" rx="14" ry="8" fill="var(--primary)" opacity="0.18" />
    </svg>
  );
}

function FootballSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="rim-fb" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="body-fb" cx="65%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#2b2b31" />
          <stop offset="100%" stopColor="#101014" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#body-fb)" stroke="url(#rim-fb)" strokeWidth="2.5" />
      <polygon points="50,33 65,44 59,61 41,61 35,44" fill="#000000" opacity="0.55" />
      <path
        d="M50 33V17M65 44l15-6M59 61l10 13M41 61L31 74M35 44l-15-6"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <ellipse cx="63" cy="27" rx="13" ry="8" fill="#ffffff" opacity="0.12" />
    </svg>
  );
}

function RacquetSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 122" className={className} aria-hidden>
      <defs>
        <linearGradient id="rim-rq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="32" rx="23" ry="29" fill="#131015" stroke="url(#rim-rq)" strokeWidth="4" />
      <path
        d="M14 18v28M22 12v40M30 10v44M38 12v40M46 18v28M10 24h40M8 34h44M10 44h40M14 52h32"
        stroke="#ffffff"
        strokeWidth="0.7"
        opacity="0.07"
      />
      <path d="M23 59l4 16M37 59l-4 16" stroke="#1c161a" strokeWidth="4" strokeLinecap="round" />
      <rect x="25" y="74" width="10" height="40" rx="5" fill="#1c161a" stroke="var(--primary)" strokeWidth="1.2" strokeOpacity="0.5" />
    </svg>
  );
}

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
 * equipment hanging as rim-lit silhouettes, dust in the light, film grain
 * and a heavy vignette. Built to keep white type razor-legible.
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

        {/* Equipment in the shadows */}
        <Float
          className="absolute left-[4%] bottom-[24%] w-28 opacity-90 drop-shadow-[0_30px_35px_rgba(0,0,0,0.8)] sm:w-32 md:w-44 lg:w-52"
          rotate={10}
          duration={15}
          delay={0.6}
          drift={20}
        >
          <BasketballSilhouette className="h-auto w-full" />
        </Float>
        <Float
          className="absolute right-[5%] bottom-[26%] w-24 opacity-90 drop-shadow-[0_30px_35px_rgba(0,0,0,0.8)] sm:w-28 md:w-36 lg:w-40"
          rotate={-8}
          duration={16}
          delay={1.4}
          drift={18}
        >
          <FootballSilhouette className="h-auto w-full" />
        </Float>
        <Float
          className="absolute right-[16%] top-[9%] w-14 opacity-60 blur-[1.5px] md:w-20 lg:w-24"
          rotate={26}
          duration={17}
          delay={0.2}
        >
          <RacquetSilhouette className="h-auto w-full" />
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />
      <div className="film-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
