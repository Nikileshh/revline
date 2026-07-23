import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Crown } from "lucide-react";

interface SportsHeroProps {
  instagramUrl: string;
  memberCount: number;
  sessionsHosted: number;
}

/**
 * Fullscreen hero: the athletes still behind a cinematic grade — slow
 * push-in, directional scrims, vignette, light sweep and film grain — with
 * all copy overlaid on the open left side of the frame.
 */
export function SportsHero({ instagramUrl, memberCount, sessionsHosted }: SportsHeroProps) {
  const stats = [
    memberCount > 0 && { value: `${memberCount}+`, label: "Athletes joined us so far" },
    sessionsHosted > 0 && { value: `${sessionsHosted}+`, label: "Sessions hosted" },
    { value: "6", label: "Sports, one crew" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section className="relative -mt-20 flex min-h-screen w-full items-center overflow-hidden bg-black sm:-mt-24">
      {/* The still, slowly pushing in */}
      <div className="animate-ken-burns absolute inset-0">
        <Image
          src="/hero-athletes.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-center"
        />
      </div>

      {/* Grade: deepen the left so the copy always reads */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"
      />
      {/* Seat the frame top and bottom */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45"
      />
      {/* Warm ember lift, matching the scene's red ambience */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_72%_45%,rgba(190,30,25,0.22),transparent_70%)]"
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.72))]"
      />
      {/* Anamorphic light sweep */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-light-sweep absolute inset-y-0 -left-1/3 w-1/4 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
      {/* Film grain */}
      <div aria-hidden className="film-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />

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
        <h1 className="animate-fade-up-delay-1 font-podium uppercase leading-[0.92] tracking-tight text-white [text-shadow:0_4px_40px_rgba(0,0,0,0.75)]">
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">Consistency</span>
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">builds power.</span>
          <span className="block text-[clamp(2.4rem,6.4vw,5.5rem)]">Community builds purpose.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up-delay-2 mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/75 [text-shadow:0_2px_18px_rgba(0,0,0,0.7)] sm:text-base lg:mt-8">
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
            className="group flex items-center gap-2 border border-white/30 px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white backdrop-blur-[2px] transition-colors hover:border-white/60 hover:bg-white/10 sm:px-7 sm:py-4 sm:text-xs"
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
