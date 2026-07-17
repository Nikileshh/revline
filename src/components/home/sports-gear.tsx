"use client";

import { useId } from "react";

/**
 * Shaded sports equipment. Each piece is lit from the upper left with a
 * specular highlight, core color, and falloff into shadow so it reads as a
 * physical object against the dark arena. Gradient ids are namespaced with
 * useId so the pieces can appear many times on one page.
 */

export function Basketball({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}b`} cx="32%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#F7A05C" />
          <stop offset="45%" stopColor="#D9752F" />
          <stop offset="80%" stopColor="#93481A" />
          <stop offset="100%" stopColor="#5E2C0D" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}b)`} />
      {/* Curved seams sell the sphere */}
      <path
        d="M50 3C43 30 43 70 50 97M3 50c27-7 67-7 94 0M16 14c18 17 18 55 0 72M84 14c-18 17-18 55 0 72"
        stroke="#3A1D08"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <ellipse cx="35" cy="24" rx="13" ry="8" fill="#ffffff" opacity="0.28" />
      <ellipse cx="32" cy="21" rx="6" ry="3.5" fill="#ffffff" opacity="0.4" />
    </svg>
  );
}

export function Football({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}f`} cx="32%" cy="26%" r="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#E6E9EE" />
          <stop offset="82%" stopColor="#A9AEBB" />
          <stop offset="100%" stopColor="#666C7A" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}f)`} />
      <g clipPath={`url(#${id}c)`}>
        <polygon points="50,34 64,44 59,60 41,60 36,44" fill="#151922" />
        {/* Edge panels, clipped by the ball */}
        <polygon points="50,-6 62,2 58,16 42,16 38,2" fill="#151922" opacity="0.9" />
        <polygon points="94,32 104,44 98,58 84,54 84,40" fill="#151922" opacity="0.9" />
        <polygon points="78,88 64,94 56,82 66,70 80,74" fill="#151922" opacity="0.9" />
        <polygon points="22,88 36,94 44,82 34,70 20,74" fill="#151922" opacity="0.9" />
        <polygon points="-4,44 6,32 16,40 16,54 2,58" fill="#151922" opacity="0.9" />
        <path
          d="M50 34V16M64 44l20-6M59 60l9 16M41 60l-9 16M36 44l-20-6"
          stroke="#151922"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>
      <ellipse cx="34" cy="24" rx="13" ry="8" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

export function TennisRacquet({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 122" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}fr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5468" />
          <stop offset="55%" stopColor="#232936" />
          <stop offset="100%" stopColor="#10131B" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B24A56" />
          <stop offset="100%" stopColor="#5F2229" />
        </linearGradient>
      </defs>
      {/* Strings */}
      <path
        d="M15 18v29M22 12v41M30 10v45M38 12v41M45 18v29M11 24h38M9 33h42M9 42h42M13 51h34"
        stroke="#E4E9F2"
        strokeWidth="0.9"
        opacity="0.5"
      />
      {/* Frame with maroon inlay */}
      <ellipse cx="30" cy="32" rx="23" ry="29" fill="none" stroke={`url(#${id}fr)`} strokeWidth="5" />
      <ellipse cx="30" cy="32" rx="23" ry="29" fill="none" stroke="var(--primary)" strokeWidth="1.4" opacity="0.85" strokeDasharray="30 14" />
      {/* Throat */}
      <path d="M22 58l5 17M38 58l-5 17" stroke={`url(#${id}fr)`} strokeWidth="4.5" strokeLinecap="round" />
      {/* Wrapped grip */}
      <rect x="25" y="74" width="10" height="40" rx="4.5" fill={`url(#${id}g)`} />
      <path d="M25 80l10 4M25 88l10 4M25 96l10 4M25 104l10 4" stroke="#3d151a" strokeWidth="1.4" opacity="0.7" />
      <ellipse cx="30" cy="115" rx="6" ry="3" fill="#2A1013" />
    </svg>
  );
}

export function Shuttlecock({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#D5DAE3" />
          <stop offset="100%" stopColor="#9AA2B1" />
        </linearGradient>
        <radialGradient id={`${id}k`} cx="35%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#FAF0DE" />
          <stop offset="70%" stopColor="#D9BC8F" />
          <stop offset="100%" stopColor="#A8865A" />
        </radialGradient>
      </defs>
      <path d="M28 70 L12 16 L68 16 L52 70 Z" fill={`url(#${id}s)`} stroke="#79818F" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M40 70V16M30 70L20 16M50 70l10-54M17 33h46M22 50h36" stroke="#79818F" strokeWidth="1.3" opacity="0.75" />
      <ellipse cx="40" cy="16" rx="28" ry="4" fill="#ffffff" opacity="0.7" />
      <circle cx="40" cy="80" r="12" fill={`url(#${id}k)`} />
      <path d="M29 75a12 12 0 0 0 22 0" fill="none" stroke="var(--primary)" strokeWidth="3.5" />
      <ellipse cx="36" cy="76" rx="4" ry="2.5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

export function BaseballBat({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 140" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E7BC8C" />
          <stop offset="45%" stopColor="#C08A4F" />
          <stop offset="100%" stopColor="#7A4E20" />
        </linearGradient>
      </defs>
      <path
        d="M20 4c11 0 12 34 7 66-2 13-3 24-3 36h-8c0-12-1-23-3-36C8 38 9 4 20 4Z"
        fill={`url(#${id}w)`}
      />
      <path d="M14 26c2 18 3 36 4 52M24 20c1 20 0 40-1 58" stroke="#8A5A28" strokeWidth="1" opacity="0.6" fill="none" />
      {/* Taped handle */}
      <rect x="15" y="94" width="10" height="20" rx="3" fill="#211E24" />
      <path d="M15 98l10 3M15 104l10 3M15 110l10 3" stroke="#000000" strokeWidth="1" opacity="0.5" />
      <ellipse cx="20" cy="117" rx="8.5" ry="5" fill="#2C2830" />
      <path d="M16 8c1.5-2 6.5-2 8 0" stroke="#F2D7B3" strokeWidth="1.6" fill="none" opacity="0.8" />
    </svg>
  );
}
