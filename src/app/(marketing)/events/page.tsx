import type { Metadata } from "next";
import { CalendarX } from "lucide-react";

import { EventCard } from "@/components/events/event-card";
import { Reveal } from "@/components/shared/reveal";
import {
  getCompletedEvents,
  getConfirmedCount,
  getUpcomingEvents,
} from "@/server/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and completed RevLine sessions — turf football, group runs, treks, swims and more. Register for this weekend's session.",
};

export default async function EventsPage() {
  const [upcoming, completed] = await Promise.all([
    getUpcomingEvents(),
    getCompletedEvents(),
  ]);
  const counts = await Promise.all(upcoming.map((e) => getConfirmedCount(e.id)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Sessions
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide sm:text-6xl">
          Events
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every weekend, a new way to move. Grab your spot before it fills up.
        </p>
      </Reveal>

      <section aria-labelledby="upcoming-heading" className="mt-12">
        <h2
          id="upcoming-heading"
          className="font-display text-3xl font-bold uppercase tracking-wide"
        >
          Upcoming
        </h2>
        {upcoming.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.06}>
                <EventCard event={event} confirmedCount={counts[i]} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
            <CalendarX className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-4 font-medium">No upcoming sessions right now</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The next one is being planned — check back soon or watch our Instagram.
            </p>
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section aria-labelledby="completed-heading" className="mt-16">
          <h2
            id="completed-heading"
            className="font-display text-3xl font-bold uppercase tracking-wide text-muted-foreground"
          >
            Completed
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.06}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
