"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StadiumScene } from "@/components/home/stadium-scene";

const IMPACT = 0.86; // seconds — the moment REV and LINE collide
const WORD_DUR = 1.12;
const TOTAL_MS = 3100;

type WKAudioContext = typeof AudioContext;

/**
 * Synthesized whoosh (two, converging) + boom (low drop + dusty noise thud)
 * scheduled around the impact. Returns a teardown. Browsers block audio
 * until the user has interacted with the site, so this is best-effort.
 */
function playImpactSound(): () => void {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: WKAudioContext }).webkitAudioContext;
    if (!Ctx) return () => {};
    const ctx = new Ctx();
    void ctx.resume?.();
    const now = ctx.currentTime;

    const whoosh = (pan: number) => {
      const dur = IMPACT;
      const size = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, size, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 0.7;
      bp.frequency.setValueAtTime(260, now);
      bp.frequency.exponentialRampToValueAtTime(2200, now + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + dur * 0.85);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(bp).connect(g);
      if (ctx.createStereoPanner) {
        const p = ctx.createStereoPanner();
        p.pan.value = pan;
        g.connect(p).connect(ctx.destination);
      } else {
        g.connect(ctx.destination);
      }
      src.start(now);
      src.stop(now + dur);
    };
    whoosh(-0.6);
    whoosh(0.6);

    const t0 = now + IMPACT;
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);

    // Main boom — deeper pitch drop, longer tail
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t0);
    osc.frequency.exponentialRampToValueAtTime(30, t0 + 0.7);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.exponentialRampToValueAtTime(1.0, t0 + 0.02);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
    osc.connect(og).connect(master);
    osc.start(t0);
    osc.stop(t0 + 1.0);

    // Sub-bass layer for chest-thump weight
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(80, t0);
    sub.frequency.exponentialRampToValueAtTime(24, t0 + 0.6);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, t0);
    sg.gain.exponentialRampToValueAtTime(0.9, t0 + 0.03);
    sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
    sub.connect(sg).connect(master);
    sub.start(t0);
    sub.stop(t0 + 0.95);

    // Distorted crack for the initial hit
    const crack = ctx.createOscillator();
    crack.type = "square";
    crack.frequency.setValueAtTime(120, t0);
    crack.frequency.exponentialRampToValueAtTime(50, t0 + 0.08);
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.35, t0);
    cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    crack.connect(cg).connect(master);
    crack.start(t0);
    crack.stop(t0 + 0.13);

    // Dusty noise thud
    const nd = 0.7;
    const nsize = Math.floor(ctx.sampleRate * nd);
    const nbuf = ctx.createBuffer(1, nsize, ctx.sampleRate);
    const ndata = nbuf.getChannelData(0);
    for (let i = 0; i < nsize; i++) ndata[i] = (Math.random() * 2 - 1) * (1 - i / nsize);
    const ns = ctx.createBufferSource();
    ns.buffer = nbuf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1600, t0);
    lp.frequency.exponentialRampToValueAtTime(150, t0 + nd);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.6, t0);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + nd);
    ns.connect(lp).connect(ng).connect(master);
    ns.start(t0);
    ns.stop(t0 + nd);

    // If the browser blocked autoplay, unlock on the first interaction.
    let unlockers: (() => void)[] = [];
    if (ctx.state === "suspended") {
      const unlock = () => void ctx.resume?.();
      const events = ["pointerdown", "keydown", "touchstart"] as const;
      events.forEach((ev) => window.addEventListener(ev, unlock, { once: true, passive: true }));
      unlockers = events.map((ev) => () => window.removeEventListener(ev, unlock));
    }

    return () => {
      unlockers.forEach((off) => off());
      try {
        void ctx.close();
      } catch {
        /* already closed */
      }
    };
  } catch {
    return () => {};
  }
}

/**
 * Cinematic opening: REV charges in from the left, LINE from the right; they
 * collide centre-screen with a warm bloom, camera shake and a whoosh + boom,
 * then the card lifts to reveal the page. Plays on every load; click /
 * Escape skips; reduced motion goes straight in.
 */
export function CinematicIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduce) return;
    const stopSound = playImpactSound();
    const timer = setTimeout(() => setShow(false), TOTAL_MS);
    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && !reduce && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.035 }}
          transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
          onClick={() => setShow(false)}
          role="button"
          aria-label="Skip intro"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") setShow(false);
          }}
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden"
        >
          {/* Static scene under the intro — the hero runs the animated one */}
          <StadiumScene animated={false} />

          <motion.div
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            className="relative flex h-full flex-col items-center justify-center px-6"
          >
            {/* Soft warm bloom on contact — full frame, no hard edge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ delay: IMPACT, duration: 0.5, times: [0, 0.16, 1], ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgba(255,224,176,0.6),transparent_70%)]"
            />

            {/* Camera shake + squash on impact */}
            <motion.div
              animate={{
                x: [0, 0, -6, 5, -3, 1, 0],
                y: [0, 0, 4, -4, 2, -1, 0],
                scaleX: [1, 1, 0.975, 1.015, 0.997, 1, 1],
              }}
              transition={{
                duration: 0.5,
                delay: IMPACT - 0.02,
                times: [0, 0.06, 0.22, 0.44, 0.64, 0.84, 1],
                ease: "easeOut",
              }}
              className="relative"
            >
              <h1 className="flex font-power text-[13vw] uppercase leading-[0.9] tracking-[-0.01em] [transform:skewX(-7deg)] sm:text-[9rem]">
                <motion.span
                  animate={{ x: ["-64vw", "0vw", "-1.4vw", "0vw"] }}
                  transition={{
                    duration: WORD_DUR,
                    times: [0, IMPACT / WORD_DUR, (IMPACT + 0.12) / WORD_DUR, 1],
                    ease: ["easeIn", "easeOut", "easeOut"],
                  }}
                  className="text-[#fdf4df] [text-shadow:0_6px_50px_rgba(0,0,0,0.6)]"
                >
                  REV
                </motion.span>
                <motion.span
                  animate={{ x: ["64vw", "0vw", "1.4vw", "0vw"] }}
                  transition={{
                    duration: WORD_DUR,
                    times: [0, IMPACT / WORD_DUR, (IMPACT + 0.12) / WORD_DUR, 1],
                    ease: ["easeIn", "easeOut", "easeOut"],
                  }}
                  className="text-[#ffa03c] [text-shadow:0_3px_12px_rgba(10,4,12,0.95),0_0_55px_rgba(255,150,40,0.55)]"
                >
                  LINE
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: IMPACT + 0.6, duration: 0.6, ease: "easeOut" }}
              className="mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-[#f3e6cc]/85 sm:text-sm"
            >
              A Hybrid Training Club
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.7 }}
              className="absolute bottom-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#f3e6cc]/50"
            >
              Click to enter
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
