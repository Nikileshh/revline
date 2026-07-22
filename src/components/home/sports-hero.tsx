import Link from "next/link";
import { ArrowUpRight, Award, Crown } from "lucide-react";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

interface SportsHeroProps {
  instagramUrl: string;
  memberCount: number;
  sessionsHosted: number;
}

/**
 * Fullscreen hero: looping video behind, everything overlaid. Pulled full
 * bleed with negative margins so it fills the viewport under the fixed nav.
 */
export function SportsHero({ instagramUrl, memberCount, sessionsHosted }: SportsHeroProps) {
  const stats = [
    memberCount > 0 && { value: `${memberCount}+`, label: "Athletes joined us so far" },
    sessionsHosted > 0 && { value: `${sessionsHosted}+`, label: "Sessions hosted" },
    { value: "6", label: "Sports, one crew" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section className="relative -mt-20 flex min-h-screen w-full items-center overflow-hidden sm:-mt-24">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      {/* Legibility scrims */}
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
      />

      {/* Hero content */}
      <div className="relative z-10 w-full px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-20 lg:pt-32">
        {/* Tagline */}
        <div className="animate-fade-up mb-6 flex items-center gap-2 lg:mb-8">
          <Crown className="h-4 w-4 text-white/70" aria-hidden />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            A Hybrid Training Club
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up-delay-1 font-podium uppercase leading-[0.92] tracking-tight text-white">
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">Consistency</span>
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">builds power.</span>
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">Community builds purpose.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up-delay-2 mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
          Every weekend we move together — strength, cardio, mobility and endurance,
          blended into one hybrid training lifestyle. Beginner or beast,{" "}
          <span className="font-semibold text-white">just show up.</span> We&apos;ll handle
          the rest.
        </p>

        {/* CTA row */}
        <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
          <Link
            href="/events"
            className="group flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
          >
            Join this weekend&apos;s session
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 border border-white/30 px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:border-white/60 hover:bg-white/10 sm:px-7 sm:py-4 sm:text-xs"
          >
            Follow on Instagram
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>

          <div className="hidden items-center gap-3 sm:flex">
            <Award className="h-8 w-8 text-white/50" aria-hidden />
            <div className="font-inter text-xs uppercase tracking-wider text-white/60">
              <div>Every Sunday</div>
              <div>Sessions</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
