import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Dumbbell,
  HeartHandshake,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";

import { Challenge } from "@/components/home/challenge";
import { SportsHero } from "@/components/home/sports-hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { VelocityMarquee } from "@/components/home/velocity-marquee";
import { EventCard } from "@/components/events/event-card";
import { Reveal } from "@/components/shared/reveal";
import {
  getCompletedEvents,
  getConfirmedCount,
  getSiteSettings,
  getTestimonials,
  getTotalConfirmedCount,
  getUpcomingEvents,
} from "@/server/queries";

// Cached and revalidated — instant navigation, refreshed every 60s and on
// new registrations via revalidatePath.
export const revalidate = 60;

const SPORTS = ["Running", "Football", "Turf", "Trekking", "Swimming", "Workouts"];

const PILLARS = [
  {
    icon: Dumbbell,
    title: "Hybrid Training",
    body: "Strength, cardio, mobility and endurance blended into one lifestyle — group workouts outdoors, on turf, on trails and in gyms.",
  },
  {
    icon: CalendarCheck,
    title: "Every Weekend",
    body: "Sessions every Sunday: turf football, group runs, treks, swims and more. Weekday check-ins keep the momentum alive.",
  },
  {
    icon: HeartHandshake,
    title: "Real Community",
    body: "Group chats for check-ins, challenges and support. Anyone, anywhere, anytime — beginner or beast, you belong here.",
  },
] as const;

export default async function HomePage() {
  const [events, completedEvents, testimonials, settings, memberCount] = await Promise.all([
    getUpcomingEvents(),
    getCompletedEvents(),
    getTestimonials(),
    getSiteSettings(),
    getTotalConfirmedCount(),
  ]);

  const nextEvents = events.slice(0, 3);
  const counts = await Promise.all(nextEvents.map((e) => getConfirmedCount(e.id)));

  return (
    <>
      <SportsHero instagramUrl={settings.instagram_url} memberCount={memberCount} />

      {/* Sports marquee — accelerates and flips with scroll */}
      <div className="border-y border-border bg-card/60 py-4" aria-hidden>
        <VelocityMarquee>
          {SPORTS.map((sport) => (
            <span
              key={sport}
              className="flex items-center gap-10 font-display text-xl font-bold uppercase italic tracking-[0.15em] text-foreground/40"
            >
              {sport}
              <span className="size-2 rounded-full bg-primary/70" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      {/* Proof in numbers */}
      <StatsStrip
        members={memberCount}
        sessionsHosted={completedEvents.length}
        sportsCount={SPORTS.length}
      />

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Why RevLine exists
              </p>
              <h2 className="mt-3 text-balance font-display text-5xl font-bold uppercase leading-[1.02] tracking-wide text-foreground sm:text-6xl">
                We were looking for more than solo workouts.
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                We wanted a space where people come together to train, grow, and support
                each other — a community built on consistency, strength, and shared energy.
              </p>
              <p>
                Our mission: build a strong, purpose-driven community where every
                individual can move better, live stronger, and stay consistent — together.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_50px_color-mix(in_oklab,var(--primary)_25%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <span className="flex size-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
                  <pillar.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The challenge */}
      <Challenge />

      {/* Upcoming events */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  This weekend &amp; beyond
                </p>
                <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide text-foreground sm:text-6xl">
                  Upcoming sessions
                </h2>
              </div>
              <Link
                href="/events"
                className="group flex w-fit items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                All events
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>

          {nextEvents.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nextEvents.map((event, i) => (
                <Reveal key={event.id} delay={i * 0.08}>
                  <EventCard event={event} confirmedCount={counts[i]} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
                <Sparkles className="mx-auto size-8 text-primary" aria-hidden />
                <p className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                  Next session dropping soon
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Follow us on Instagram or join the WhatsApp community to hear first.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              From the crew
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide text-foreground sm:text-6xl">
              What members say
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition-colors hover:border-primary/40">
                  <Quote className="size-5 text-primary" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold text-foreground">{t.name}</span>
                    {t.label && <span className="text-muted-foreground"> · {t.label}</span>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/40 bg-gradient-to-br from-primary/30 via-card to-background p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-primary/20 blur-3xl" />
            <h2 className="relative text-balance font-display text-5xl font-bold uppercase italic tracking-wide text-foreground sm:text-6xl">
              Ready to join the movement?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-balance text-foreground/75">
              If you&apos;re ready to move, grow, and commit — register for a session or
              jump straight into the community chat.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/events"
                className="flex h-12 items-center gap-3 rounded-full bg-primary pl-2 pr-7 text-primary-foreground shadow-[0_0_45px_color-mix(in_oklab,var(--primary)_50%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_85%,white)]"
              >
                <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-bold uppercase tracking-wide">
                  Register for a session
                </span>
              </Link>
              {settings.whatsapp_community_url && (
                <a
                  href={settings.whatsapp_community_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center gap-2 rounded-full border border-border bg-card px-7 text-sm font-bold uppercase tracking-wide text-foreground backdrop-blur transition-colors hover:border-foreground/40 hover:bg-accent"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Join the WhatsApp community
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
