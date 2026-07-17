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
  // Unit pentagon (apex up), reused for the ring panels via transforms
  const pent = "0,-12 11.4,-3.7 7,9.7 -7,9.7 -11.4,-3.7";
  // Ring panel placements: angle around the ball, squashed radially to fake curvature
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
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="42%" stopColor="#F1F3F7" />
          <stop offset="75%" stopColor="#C2C8D3" />
          <stop offset="100%" stopColor="#737A89" />
        </radialGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#232936" />
          <stop offset="100%" stopColor="#10141D" />
        </linearGradient>
        <radialGradient id={`${id}r`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0A0C12" stopOpacity="0" />
          <stop offset="72%" stopColor="#0A0C12" stopOpacity="0" />
          <stop offset="92%" stopColor="#0A0C12" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0A0C12" stopOpacity="0.5" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="47" fill={`url(#${id}f)`} />

      <g clipPath={`url(#${id}c)`}>
        {/* Centre panel */}
        <polygon points="50,33 64.3,43.4 58.8,60.2 41.2,60.2 35.7,43.4" fill={`url(#${id}p)`} />
        {/* Ring panels, squashed toward the rim so the surface reads as a sphere */}
        {ring.map((r) => (
          <polygon
            key={r.a}
            points={pent}
            fill={`url(#${id}p)`}
            transform={`translate(${r.x} ${r.y}) rotate(${r.a + 90}) scale(1 0.62)`}
          />
        ))}
        {/* Seams: centre panel corners out to the ring panels, gently bowed */}
        <path
          d="M50 33Q49 24 50 21M64.3 43.4Q72 41 76.5 41M58.8 60.2Q64 66 66.5 70M41.2 60.2Q36 66 33.5 70M35.7 43.4Q28 41 23.5 41"
          stroke="#141824"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Rim seams between neighbouring ring panels */}
        <path
          d="M62 12q12 6 19 17M89 48q-1 14-9 24M56 88q-6 1-12 0M20 72q-8-10-9-24M31 15q-12 6-18 17"
          stroke="#141824"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>

      {/* Sphere shading: inner rim shadow, then speculars */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}r)`} />
      <ellipse cx="33" cy="24" rx="14" ry="9" fill="#ffffff" opacity="0.5" />
      <ellipse cx="29" cy="20" rx="5.5" ry="3.5" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function TennisRacquet({ className }: { className?: string }) {
  const id = useId();
  // Dense 12x15 string bed clipped to the head
  const verticals = Array.from({ length: 12 }, (_, i) => 24 + i * 4.4);
  const horizontals = Array.from({ length: 15 }, (_, i) => 14 + i * 5.4);
  return (
    <svg viewBox="0 0 90 200" className={className} aria-hidden>
      <defs>
        {/* Two-tone paint job: maroon into black toward the throat */}
        <linearGradient id={`${id}paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B24955" />
          <stop offset="45%" stopColor="#8E3B45" />
          <stop offset="80%" stopColor="#3A1B20" />
          <stop offset="100%" stopColor="#17141A" />
        </linearGradient>
        <linearGradient id={`${id}graphite`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#343B49" />
          <stop offset="100%" stopColor="#12151C" />
        </linearGradient>
        <linearGradient id={`${id}grip`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2E2A31" />
          <stop offset="45%" stopColor="#1B181E" />
          <stop offset="100%" stopColor="#0E0C10" />
        </linearGradient>
        <clipPath id={`${id}bed`}>
          <ellipse cx="45" cy="52" rx="30" ry="42" />
        </clipPath>
      </defs>

      {/* String bed */}
      <g clipPath={`url(#${id}bed)`}>
        <ellipse cx="45" cy="52" rx="30" ry="42" fill="#0E1116" opacity="0.35" />
        {verticals.map((x) => (
          <line key={`v${x}`} x1={x} y1="8" x2={x} y2="96" stroke="#EDF0F5" strokeWidth="0.8" opacity="0.7" />
        ))}
        {horizontals.map((y) => (
          <line key={`h${y}`} x1="13" y1={y} x2="77" y2={y} stroke="#D9DEE7" strokeWidth="0.7" opacity="0.6" />
        ))}
        {/* Brand stencil on the strings */}
        <text
          x="45"
          y="62"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          fontStyle="italic"
          fill="var(--primary)"
          opacity="0.8"
          fontFamily="var(--font-display), sans-serif"
        >
          R
        </text>
      </g>

      {/* Frame: painted outer hoop, dark inner rim, bumper on top */}
      <ellipse cx="45" cy="52" rx="34" ry="46" fill="none" stroke={`url(#${id}paint)`} strokeWidth="8" />
      <ellipse cx="45" cy="52" rx="29.5" ry="41.5" fill="none" stroke="#0C0A0E" strokeWidth="2" opacity="0.9" />
      <path d="M20 24C27 12 63 12 70 24" fill="none" stroke="#17141A" strokeWidth="8" strokeLinecap="round" />
      {/* Paint highlight along the upper-left of the hoop */}
      <path d="M15 42C15 26 26 13 41 9" fill="none" stroke="#E9A5AD" strokeWidth="2" strokeLinecap="round" opacity="0.65" />

      {/* Throat: open V into the shaft, maroon pinstripes on the arms */}
      <path
        d="M17 68c4 22 18 30 22 44h12c4-14 18-22 22-44l-7-3c-5 18-15 26-19 38-4-12-14-20-19-38Z"
        fill={`url(#${id}graphite)`}
      />
      <path d="M21 74c5 16 14 24 18 34M69 74c-5 16-14 24-18 34" stroke="var(--primary)" strokeWidth="1.6" fill="none" opacity="0.85" />

      {/* Shaft + wrapped grip + butt cap */}
      <rect x="39" y="110" width="12" height="12" fill={`url(#${id}graphite)`} />
      <rect x="37.5" y="121" width="15" height="60" rx="5.5" fill={`url(#${id}grip)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1="37.5"
          y1={126 + i * 6}
          x2="52.5"
          y2={130 + i * 6}
          stroke="#000000"
          strokeWidth="1.6"
          opacity="0.55"
        />
      ))}
      <line x1="39" y1="124" x2="39" y2="178" stroke="#4A4550" strokeWidth="1" opacity="0.6" />
      <rect x="35.5" y="180" width="19" height="11" rx="4" fill="#17141A" />
      <circle cx="45" cy="185.5" r="3" fill="var(--primary)" opacity="0.9" />
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
