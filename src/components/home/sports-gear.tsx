"use client";

import { useId } from "react";

/**
 * Sports equipment in the brand palette — grey and black bodies with maroon
 * accents, lit from the upper left. Gradient ids are namespaced with useId
 * so the pieces can appear many times on one page.
 */

export function Basketball({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}b`} cx="32%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#585D68" />
          <stop offset="50%" stopColor="#3A3D45" />
          <stop offset="100%" stopColor="#1B1C21" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}b)`} />
      <path
        d="M50 3C43 30 43 70 50 97M3 50c27-7 67-7 94 0M16 14c18 17 18 55 0 72M84 14c-18 17-18 55 0 72"
        stroke="var(--primary)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <ellipse cx="35" cy="24" rx="13" ry="8" fill="#ffffff" opacity="0.16" />
    </svg>
  );
}

export function Football({ className }: { className?: string }) {
  const id = useId();
  const pent = "0,-12 11.4,-3.7 7,9.7 -7,9.7 -11.4,-3.7";
  const ring = [
    { a: -90, x: 50, y: 15 },
    { a: -18, x: 83.3, y: 39.2 },
    { a: 54, x: 70.6, y: 78.3 },
    { a: 126, x: 29.4, y: 78.3 },
    { a: 198, x: 16.7, y: 39.2 },
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}f`} cx="34%" cy="28%" r="95%">
          <stop offset="0%" stopColor="#E4E6EB" />
          <stop offset="45%" stopColor="#C4C8D1" />
          <stop offset="78%" stopColor="#8B909C" />
          <stop offset="100%" stopColor="#4E525C" />
        </radialGradient>
        <radialGradient id={`${id}r`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0A0C12" stopOpacity="0" />
          <stop offset="72%" stopColor="#0A0C12" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A0C12" stopOpacity="0.45" />
        </radialGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#9E4551" />
          <stop offset="100%" stopColor="#5F2229" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="47" fill={`url(#${id}f)`} />

      <g clipPath={`url(#${id}c)`}>
        {/* Maroon centre panel, black ring panels */}
        <polygon points="50,33 64.3,43.4 58.8,60.2 41.2,60.2 35.7,43.4" fill={`url(#${id}m)`} />
        {ring.map((r) => (
          <polygon
            key={r.a}
            points={pent}
            fill="#191B21"
            transform={`translate(${r.x} ${r.y}) rotate(${r.a + 90}) scale(1 0.62)`}
          />
        ))}
        <path
          d="M50 33Q49 24 50 21M64.3 43.4Q72 41 76.5 41M58.8 60.2Q64 66 66.5 70M41.2 60.2Q36 66 33.5 70M35.7 43.4Q28 41 23.5 41"
          stroke="#191B21"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>

      <circle cx="50" cy="50" r="47" fill={`url(#${id}r)`} />
      <ellipse cx="33" cy="24" rx="14" ry="9" fill="#ffffff" opacity="0.4" />
    </svg>
  );
}

export function TennisRacquet({ className }: { className?: string }) {
  const id = useId();
  const verticals = Array.from({ length: 12 }, (_, i) => 24 + i * 4.4);
  const horizontals = Array.from({ length: 15 }, (_, i) => 14 + i * 5.4);
  return (
    <svg viewBox="0 0 90 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#585D68" />
          <stop offset="55%" stopColor="#2C2F37" />
          <stop offset="100%" stopColor="#15161B" />
        </linearGradient>
        <linearGradient id={`${id}grip`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A4444F" />
          <stop offset="55%" stopColor="#742B33" />
          <stop offset="100%" stopColor="#471A1F" />
        </linearGradient>
        <clipPath id={`${id}bed`}>
          <ellipse cx="45" cy="52" rx="30" ry="42" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}bed)`}>
        <ellipse cx="45" cy="52" rx="30" ry="42" fill="#0E1013" opacity="0.4" />
        {verticals.map((x) => (
          <line key={`v${x}`} x1={x} y1="8" x2={x} y2="96" stroke="#C9CCD4" strokeWidth="0.8" opacity="0.55" />
        ))}
        {horizontals.map((y) => (
          <line key={`h${y}`} x1="13" y1={y} x2="77" y2={y} stroke="#AEB2BC" strokeWidth="0.7" opacity="0.45" />
        ))}
        <text
          x="45"
          y="62"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          fontStyle="italic"
          fill="var(--primary)"
          opacity="0.85"
          fontFamily="var(--font-display), sans-serif"
        >
          R
        </text>
      </g>

      <ellipse cx="45" cy="52" rx="34" ry="46" fill="none" stroke={`url(#${id}paint)`} strokeWidth="8" />
      <ellipse cx="45" cy="52" rx="34" ry="46" fill="none" stroke="var(--primary)" strokeWidth="1.6" opacity="0.9" strokeDasharray="34 16" />
      <ellipse cx="45" cy="52" rx="29.5" ry="41.5" fill="none" stroke="#0C0A0E" strokeWidth="2" opacity="0.9" />
      <path d="M20 24C27 12 63 12 70 24" fill="none" stroke="#101116" strokeWidth="8" strokeLinecap="round" />
      <path d="M15 42C15 26 26 13 41 9" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />

      <path
        d="M17 68c4 22 18 30 22 44h12c4-14 18-22 22-44l-7-3c-5 18-15 26-19 38-4-12-14-20-19-38Z"
        fill={`url(#${id}paint)`}
      />
      <path d="M21 74c5 16 14 24 18 34M69 74c-5 16-14 24-18 34" stroke="var(--primary)" strokeWidth="1.6" fill="none" opacity="0.9" />

      <rect x="39" y="110" width="12" height="12" fill="#1C1E24" />
      <rect x="37.5" y="121" width="15" height="60" rx="5.5" fill={`url(#${id}grip)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1="37.5"
          y1={126 + i * 6}
          x2="52.5"
          y2={130 + i * 6}
          stroke="#2A0F13"
          strokeWidth="1.6"
          opacity="0.6"
        />
      ))}
      <rect x="35.5" y="180" width="19" height="11" rx="4" fill="#111014" />
      <circle cx="45" cy="185.5" r="3" fill="var(--primary)" />
    </svg>
  );
}

export function Shuttlecock({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#E8EAEE" />
          <stop offset="70%" stopColor="#B6BBC6" />
          <stop offset="100%" stopColor="#767C89" />
        </linearGradient>
        <radialGradient id={`${id}k`} cx="35%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#8E939E" />
          <stop offset="70%" stopColor="#4E525C" />
          <stop offset="100%" stopColor="#26282E" />
        </radialGradient>
      </defs>
      <path d="M28 70 L12 16 L68 16 L52 70 Z" fill={`url(#${id}s)`} stroke="#4E525C" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M40 70V16M30 70L20 16M50 70l10-54M17 33h46M22 50h36" stroke="#4E525C" strokeWidth="1.3" opacity="0.75" />
      <ellipse cx="40" cy="16" rx="28" ry="4" fill="#ffffff" opacity="0.55" />
      <circle cx="40" cy="80" r="12" fill={`url(#${id}k)`} />
      <path d="M29 75a12 12 0 0 0 22 0" fill="none" stroke="var(--primary)" strokeWidth="3.5" />
      <ellipse cx="36" cy="76" rx="4" ry="2.5" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

export function BaseballBat({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 140" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A7F8B" />
          <stop offset="45%" stopColor="#4E525C" />
          <stop offset="100%" stopColor="#25272D" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9E4551" />
          <stop offset="100%" stopColor="#5F2229" />
        </linearGradient>
      </defs>
      <path
        d="M20 4c11 0 12 34 7 66-2 13-3 24-3 36h-8c0-12-1-23-3-36C8 38 9 4 20 4Z"
        fill={`url(#${id}w)`}
      />
      <path d="M14 26c2 18 3 36 4 52M24 20c1 20 0 40-1 58" stroke="#1E2026" strokeWidth="1" opacity="0.55" fill="none" />
      {/* Maroon taped handle */}
      <rect x="15" y="94" width="10" height="20" rx="3" fill={`url(#${id}t)`} />
      <path d="M15 98l10 3M15 104l10 3M15 110l10 3" stroke="#2A0F13" strokeWidth="1" opacity="0.6" />
      <ellipse cx="20" cy="117" rx="8.5" ry="5" fill="#111014" />
      <path d="M16 8c1.5-2 6.5-2 8 0" stroke="#C9CCD4" strokeWidth="1.6" fill="none" opacity="0.6" />
    </svg>
  );
}
