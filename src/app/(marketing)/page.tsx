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

import { SportsHero } from "@/components/home/sports-hero";
import { EventCardLight } from "@/components/events/event-card-light";
import { Reveal } from "@/components/shared/reveal";
import {
  getConfirmedCount,
  getSiteSettings,
  getTestimonials,
  getTotalConfirmedCount,
  getUpcomingEvents,
} from "@/server/queries";

export const dynamic = "force-dynamic";

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
  const [events, testimonials, settings, memberCount] = await Promise.all([
    getUpcomingEvents(),
    getTestimonials(),
    getSiteSettings(),
    getTotalConfirmedCount(),
  ]);

  const nextEvents = events.slice(0, 3);
  const counts = await Promise.all(nextEvents.map((e) => getConfirmedCount(e.id)));

  return (
    <div className="bg-[#f0f0f0] text-[rgba(30,50,90,0.9)]">
      <SportsHero
        instagramUrl={settings.instagram_url}
        whatsappUrl={settings.whatsapp_community_url}
        memberCount={memberCount}
      />

      {/* Sports ticker */}
      <div className="border-y border-white/60 bg-white/40 py-4 backdrop-blur" aria-hidden>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 sm:px-6">
          {SPORTS.map((sport, i) => (
            <span
              key={sport}
              className="flex items-center gap-8 text-lg font-normal uppercase tracking-[0.15em] text-[rgba(30,50,90,0.55)]"
            >
              {sport}
              {i < SPORTS.length - 1 && (
                <span className="size-1.5 rounded-full bg-[rgba(142,59,69,0.5)]" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(142,59,69,0.85)]">
                Why RevLine exists
              </p>
              <h2 className="mt-3 text-balance text-4xl font-normal leading-tight tracking-tight text-[rgba(30,50,90,0.95)] sm:text-5xl">
                We were looking for more than solo workouts.
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-4 text-base leading-relaxed text-[#5E6470] sm:text-lg">
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
              <div className="h-full rounded-[1.5rem] border border-white/50 bg-white/60 p-6 backdrop-blur-xl">
                <span className="flex size-11 items-center justify-center rounded-full border border-[rgba(30,50,90,0.1)] bg-[rgba(30,50,90,0.06)] text-[rgba(30,50,90,0.8)]">
                  <pillar.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-2xl font-normal tracking-tight text-[rgba(30,50,90,0.95)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5E6470]">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="border-y border-white/60 bg-white/30 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(142,59,69,0.85)]">
                  This weekend &amp; beyond
                </p>
                <h2 className="mt-3 text-4xl font-normal tracking-tight text-[rgba(30,50,90,0.95)] sm:text-5xl">
                  Upcoming sessions
                </h2>
              </div>
              <Link
                href="/events"
                className="group flex w-fit items-center gap-2 rounded-full border border-[rgba(30,50,90,0.2)] bg-white/60 px-5 py-2 text-sm font-normal text-[rgba(30,50,90,0.9)] backdrop-blur transition-colors hover:bg-white"
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
                  <EventCardLight event={event} confirmedCount={counts[i]} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="mt-10 rounded-[1.5rem] border border-dashed border-[rgba(30,50,90,0.2)] bg-white/40 p-12 text-center backdrop-blur">
                <Sparkles className="mx-auto size-8 text-[rgba(30,50,90,0.5)]" aria-hidden />
                <p className="mt-4 font-medium text-[rgba(30,50,90,0.9)]">
                  Next session dropping soon
                </p>
                <p className="mt-1 text-sm text-[#5E6470]">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(142,59,69,0.85)]">
              From the crew
            </p>
            <h2 className="mt-3 text-4xl font-normal tracking-tight text-[rgba(30,50,90,0.95)] sm:text-5xl">
              What members say
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-[1.5rem] border border-white/50 bg-white/60 p-6 backdrop-blur-xl">
                  <Quote className="size-5 text-[rgba(142,59,69,0.8)]" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#4b5261]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold text-[rgba(30,50,90,0.95)]">{t.name}</span>
                    {t.label && <span className="text-[#5E6470]"> · {t.label}</span>}
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
          <div className="relative overflow-hidden rounded-[2rem] bg-[rgba(30,50,90,0.92)] p-10 text-center text-white sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-[rgba(142,59,69,0.35)] blur-3xl" />
            <h2 className="text-balance text-4xl font-normal tracking-tight sm:text-5xl">
              Ready to join the movement?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-white/70">
              If you&apos;re ready to move, grow, and commit — register for a session or
              jump straight into the community chat.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/events"
                className="group flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-6 text-[rgba(30,50,90,0.95)] transition-colors hover:bg-white/90"
              >
                <span className="flex items-center justify-center rounded-full bg-[rgba(30,50,90,0.1)] p-1.5">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-normal">Register for a session</span>
              </Link>
              {settings.whatsapp_community_url && (
                <a
                  href={settings.whatsapp_community_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-normal text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Join the WhatsApp community
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
