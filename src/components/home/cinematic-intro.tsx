"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Volume2 } from "lucide-react";

const IMPACT = 0.86; // seconds — the moment REV and LINE collide
const WORD_DUR = 1.12;
const TOTAL_MS = 3100;

/** A light haze behind the words (deterministic for SSR). */
const CLOUD = [
  { x: -230, y: -20, s: 190, dur: 1.5 },
  { x: 215, y: -40, s: 200, dur: 1.6 },
  { x: -70, y: -60, s: 170, dur: 1.45 },
  { x: 120, y: 30, s: 180, dur: 1.5 },
  { x: 0, y: 20, s: 210, dur: 1.6 },
] as const;

/** A few motes kicked out of the collision. */
const MOTES = [
  { a: 12, d: 250, s: 10, t: 1.0 },
  { a: 52, d: 210, s: 8, t: 0.9 },
  { a: 104, d: 230, s: 11, t: 0.95 },
  { a: 152, d: 240, s: 9, t: 1.0 },
  { a: 208, d: 220, s: 10, t: 0.92 },
  { a: 252, d: 200, s: 8, t: 0.88 },
  { a: 300, d: 235, s: 9, t: 0.95 },
  { a: 336, d: 215, s: 11, t: 0.9 },
] as const;

const rad = (deg: number) => (deg * Math.PI) / 180;

type WKAudioContext = typeof AudioContext;

/** Schedule two converging whooshes and the impact boom on a running context. */
function scheduleIntroSound(ctx: AudioContext) {
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

  // Main boom — deep pitch drop with a long tail
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
}

/**
 * Cinematic opening: REV charges in from the left, LINE from the right; they
 * collide centre-screen with a warm bloom, light dust, camera shake and a
 * whoosh + boom. Browsers block audio until the visitor interacts, so when
 * that happens an "Enter with sound" button replays the hit in sync.
 * Plays on every load; click / Escape skips; reduced motion goes straight in.
 */
export function CinematicIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const [soundBlocked, setSoundBlocked] = useState(false);
  // Dust is the heaviest part to composite — mount it just before impact so
  // the first paint on (re)load stays smooth. Tracked per run so a replay
  // starts clean without a synchronous reset.
  const [burstRun, setBurstRun] = useState(-1);
  const burst = burstRun === runKey;
  const ctxRef = useRef<AudioContext | null>(null);

  const startSound = useCallback(async () => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: WKAudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = ctxRef.current ?? new Ctx();
      ctxRef.current = ctx;
      await ctx.resume?.();
      if (ctx.state === "running") {
        scheduleIntroSound(ctx);
        setSoundBlocked(false);
      } else {
        setSoundBlocked(true);
      }
    } catch {
      setSoundBlocked(true);
    }
  }, []);

  useEffect(() => {
    if (reduce) return;
    // Deferred a tick so the audio probe never updates state mid-render.
    const soundTimer = setTimeout(() => void startSound(), 0);
    const burstTimer = setTimeout(() => setBurstRun(runKey), (IMPACT - 0.12) * 1000);
    const timer = setTimeout(() => setShow(false), TOTAL_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(burstTimer);
      clearTimeout(soundTimer);
    };
  }, [reduce, runKey, startSound]);

  useEffect(() => {
    return () => {
      try {
        void ctxRef.current?.close();
      } catch {
        /* already closed */
      }
    };
  }, []);

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
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-background"
        >
          {/* Warm orange glow, matching the hero behind it */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent)]"
          />

          {/* Light haze behind the words */}
          {burst && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {CLOUD.map((p, i) => (
                  <motion.span
                    key={`${runKey}-${i}`}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.25 }}
                    animate={{ x: p.x, y: p.y - 30, opacity: [0, 0.26, 0], scale: [0.25, 1.2] }}
                    transition={{ delay: 0.12, duration: p.dur, ease: [0.16, 0.7, 0.3, 1] }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_oklab,var(--primary)_45%,white)] blur-[22px]"
                    style={{ width: p.s, height: p.s }}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div
            key={runKey}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            className="relative flex h-full flex-col items-center justify-center px-6"
          >
            {/* Soft warm bloom on contact — full frame, no hard edge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ delay: IMPACT, duration: 0.5, times: [0, 0.16, 1], ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,color-mix(in oklab,var(--primary) 35%,white),transparent_70%)]"
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
                  className="text-foreground [text-shadow:0_6px_44px_color-mix(in_oklab,var(--foreground)_22%,transparent)]"
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
                  className="text-primary [text-shadow:0_4px_40px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                >
                  LINE
                </motion.span>
              </h1>
            </motion.div>

            {/* Light motes kicked outward */}
            {burst && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {MOTES.map((p, i) => (
                    <motion.span
                      key={`${runKey}-${i}`}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                      animate={{
                        x: Math.cos(rad(p.a)) * p.d,
                        y: Math.sin(rad(p.a)) * p.d * 0.55 - 25,
                        opacity: [0, 0.5, 0],
                        scale: [0.3, 1.1],
                      }}
                      transition={{ delay: 0.14, duration: p.t, ease: [0.15, 0.7, 0.35, 1] }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_oklab,var(--primary)_60%,white)] blur-[2px]"
                      style={{ width: p.s, height: p.s }}
                    />
                  ))}
                </div>
              </div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: IMPACT + 0.6, duration: 0.6, ease: "easeOut" }}
              className="mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-sm"
            >
              A Hybrid Training Club
            </motion.p>
          </motion.div>

          {/* Sound gate — only shown when the browser blocked autoplay */}
          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            {soundBlocked ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setRunKey((k) => k + 1);
                }}
                className="flex items-center gap-2 rounded-full border border-primary/50 bg-card/80 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Volume2 className="size-4" aria-hidden />
                Enter with sound
              </motion.button>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.7 }}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70"
              >
                Click to enter
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
