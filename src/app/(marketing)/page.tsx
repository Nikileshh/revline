import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Dumbbell,
  HeartHandshake,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";

import { Hero } from "@/components/home/hero";
import { EventCard } from "@/components/events/event-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import {
  getConfirmedCount,
  getSiteSettings,
  getTestimonials,
  getUpcomingEvents,
} from "@/server/queries";

export const dynamic = "force-dynamic";

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
  const [events, testimonials, settings] = await Promise.all([
    getUpcomingEvents(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  const nextEvents = events.slice(0, 3);
  const counts = await Promise.all(nextEvents.map((e) => getConfirmedCount(e.id)));

  return (
    <>
      <Hero instagramUrl={settings.instagram_url} />

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Why RevLine exists
              </p>
              <h2 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-tight tracking-wide sm:text-5xl">
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
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <pillar.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide">
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

      {/* Upcoming events */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  This weekend &amp; beyond
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
                  Upcoming sessions
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/events">
                  All events
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
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
              <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
                <Sparkles className="mx-auto size-8 text-muted-foreground" aria-hidden />
                <p className="mt-4 font-medium">Next session dropping soon</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              From the crew
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
              What members say
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <Quote className="size-5 text-primary" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    {t.label && (
                      <span className="text-muted-foreground"> · {t.label}</span>
                    )}
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
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-card to-card p-10 text-center sm:p-16">
            <h2 className="text-balance font-display text-4xl font-bold uppercase italic tracking-wide sm:text-5xl">
              Ready to join the movement?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
              If you&apos;re ready to move, grow, and commit — register for a session or
              jump straight into the community chat.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 font-semibold">
                <Link href="/events">
                  Register for a session
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              {settings.whatsapp_community_url && (
                <Button asChild size="lg" variant="outline" className="h-12 px-8">
                  <a
                    href={settings.whatsapp_community_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Join the WhatsApp community
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
