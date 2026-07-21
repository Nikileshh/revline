"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * The real stadium-at-sunset photograph with a cinematic grade: slow
 * push-in, warm horizon lift, edge vignette, darkened footing for type
 * legibility, and film grain.
 */
export function StadiumScene() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#160b20]">
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: [1.02, 1.08, 1.02] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/stadium.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-[50%_62%]"
        />
      </motion.div>

      {/* Grade: deepen the top sky so light text always holds */}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[#12081c]/80 via-[#12081c]/30 to-transparent" />
      {/* Warm lift around the sun's horizon line */}
      <motion.div
        className="absolute inset-x-0 top-[40%] h-[30%] bg-[radial-gradient(ellipse_50%_100%_at_50%_50%,rgba(255,150,40,0.18),transparent_70%)]"
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Ground the footing for buttons/scroll cue */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0510]/85 via-[#0a0510]/35 to-transparent" />
      {/* Vignette + grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(8,3,12,0.6))]" />
      <div className="film-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
